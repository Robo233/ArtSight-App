import { Genre } from "../../../shared/types/types-app";
import EntityPage from "../../../shared/components/EntityPage";
import { t } from "i18next";
import CardListSection from "../../../shared/components/CardListSection";
import GallerySection from "../../../shared/components/GallerySection";
import { useEntityDataApp } from "../../../shared/hooks/useEntityDataApp";
import { useParams } from "react-router";

const GenrePage = () => {
  const { id } = useParams<{ id: string }>();

  const { entity, languageCode, notFound, serverError } =
    useEntityDataApp<Genre>("genre", id, {
      id: "",
      name: "",
      descriptionLanguageCode: "",
      isFavorite: false,
      isOwner: false,
      imageDescriptions: [],
    });

  return (
    <EntityPage
      entity={entity}
      entityType="genre"
      languageCode={languageCode}
      serverError={serverError}
      notFound={notFound}
    >
      <CardListSection
        url={`${
          import.meta.env.VITE_API_URL_APP
        }/artworks/genreId?parentId=${encodeURIComponent(entity.id)}`}
        entityType="artwork"
        title={t("genrePage.artworksOfThisGenre")}
      />
      <GallerySection
        entityType="genre"
        imageDescriptions={entity.imageDescriptions}
        id={entity.id}
      />
    </EntityPage>
  );
};

export default GenrePage;
