import { useParams } from "react-router-dom";

import { t } from "i18next";

import { Artwork, ResourceTableItem } from "../../../shared/types/types-app";
import EntityPage from "../../../shared/components/EntityPage";
import Card from "../../../shared/components/Card";
import ResourceTable from "../../../shared/components/ResourceTable";
import Section from "../../../shared/components/Section";
import CardListSection from "../../../shared/components/CardListSection";
import InjectableMap from "../../../shared/components/InjectableMap";
import { useEntityDataApp } from "../../../shared/hooks/useEntityDataApp";
import ChatBot from "../../../shared/components/ChatBot";
import { getAppApiUrl } from "../../../shared/services/environment";

const ArtworkPage = () => {
  const { id } = useParams<{ id: string }>();

  const { entity, languageCode, notFound, serverError } =
    useEntityDataApp<Artwork>("artwork", id, {
      id: "",
      artistName: "",
      isFavorite: false,
      name: "",
      descriptionLanguageCode: "",
    });

  const artworkGenres = new Map(Object.entries(entity.genres || {}));
  const tableData: ResourceTableItem[] = [
    {
      label: t("shared.artist"),
      value: [entity.artistName],
      link: entity.artistId
        ? [`/artist/${encodeURIComponent(entity.artistId)}`]
        : undefined,
    },
    {
      label: artworkGenres.size > 1 ? t("shared.genres") : t("shared.genre"),
      value: Array.from(artworkGenres.values()),
      link: Array.from(artworkGenres.keys()).map(
        (genreId) => `/genre/${encodeURIComponent(genreId)}`
      ),
    },
    {
      label: t("artworkPage.medium"),
      value: entity.medium ? [entity.medium] : [],
    },
    {
      label: t("artworkPage.dimensions"),
      value: entity.dimensions ? [entity.dimensions] : [],
    },
  ].filter((item) => item.value.length > 0);

  return (
    <>
      <EntityPage
        entity={entity}
        entityType="artwork"
        languageCode={languageCode}
        serverError={serverError}
        notFound={notFound}
      >
        {tableData.length > 0 && (
          <Section title={t("shared.information")}>
            <ResourceTable data={tableData} />
          </Section>
        )}

        {entity.exhibitionId && (
          <Section title={t("artworkPage.artworkFoundAt")}>
            <Card
              id={entity.exhibitionId}
              title={entity.exhibitionName!}
              entityType="exhibition"
            />
          </Section>
        )}

        <InjectableMap
          id={entity.id}
          label={entity.name}
          latitude={entity.latitude}
          longitude={entity.longitude}
          entityType="artwork"
        />

        <Section title={t("artworkPage.analyzeArtworkUsingAI")}>
          <ChatBot id={id} languageCode={languageCode} />
        </Section>

        <CardListSection
          url={`${getAppApiUrl()}/artworkDetails/artworkId?parentId=${encodeURIComponent(
            id
          )}`}
          entityType="artworkDetail"
          title={t("artworkPage.detailsOfTheArtwork")}
        />

        {entity.artistId && (
          <CardListSection
            url={`${getAppApiUrl()}/artworks/artistId?parentId=${encodeURIComponent(
              entity.artistId
            )}`}
            entityType="artwork"
            title={`${t("artworkPage.otherArtworksBy")} ${entity.artistName}`}
            excludeId={entity.id}
          />
        )}

        {entity.exhibitionId && (
          <CardListSection
            url={`${getAppApiUrl()}/artworks/exhibitionId?parentId=${encodeURIComponent(
              entity.exhibitionId
            )}`}
            entityType="artwork"
            title={`${t("artworkPage.otherArtworksFrom")} ${
              entity.exhibitionName
            }`}
            excludeId={entity.id}
          />
        )}
      </EntityPage>
    </>
  );
};

export default ArtworkPage;
