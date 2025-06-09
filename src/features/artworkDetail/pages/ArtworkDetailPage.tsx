import { useParams } from "react-router-dom";
import { t } from "i18next";
import { ArtworkDetail } from "../../../shared/types/types-app";
import EntityPage from "../../../shared/components/EntityPage";
import Card from "../../../shared/components/Card";
import Section from "../../../shared/components/Section";
import CardListSection from "../../../shared/components/CardListSection";
import { useEntityDataApp } from "../../../shared/hooks/useEntityDataApp";
import { getAppApiUrl } from "../../../shared/services/environment";

const ArtworkDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { entity, languageCode, notFound, serverError } =
    useEntityDataApp<ArtworkDetail>("artworkDetail", id, {
      id: "",
      isFavorite: false,
      name: "",
      artworkId: "",
      artworkName: "",
      descriptionLanguageCode: "",
    });

  return (
    <EntityPage
      entity={entity}
      entityType="artworkDetail"
      languageCode={languageCode}
      serverError={serverError}
      notFound={notFound}
    >
      {entity.artworkId && (
        <Section title={t("artworkDetailPage.detailBelongsToArtwork")}>
          <Card
            id={entity.artworkId}
            title={entity.artworkName}
            entityType="artwork"
          />
        </Section>
      )}

      <CardListSection
        url={`${getAppApiUrl()}/artworkDetails/artworkId?parentId=${encodeURIComponent(
          entity.artworkId
        )}`}
        entityType="artworkDetail"
        title={t("artworkDetailPage.otherDetails")}
        excludeId={entity.id}
      />
    </EntityPage>
  );
};

export default ArtworkDetailPage;
