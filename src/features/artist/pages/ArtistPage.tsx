import { useParams } from "react-router-dom";

import { t } from "i18next";

import { Artist, ResourceTableItem } from "../../../shared/types/types-app";

import ResourceTable from "../../../shared/components/ResourceTable";
import EntityPage from "../../../shared/components/EntityPage";
import Section from "../../../shared/components/Section";
import SocialMediaSection from "../../../shared/components/SocialMediaSection";
import CardListSection from "../../../shared/components/CardListSection";
import GallerySection from "../../../shared/components/GallerySection";
import { useEntityDataApp } from "../../../shared/hooks/useEntityDataApp";

const ArtistPage = () => {
  const { id } = useParams<{ id: string }>();

  const { entity, languageCode, notFound, serverError } =
    useEntityDataApp<Artist>("artist", id, {
      id: "",
      isFavorite: false,
      name: "",
      dateOfBirth: "",
      dateOfDeath: "",
      descriptionLanguageCode: "",
      contactInfo: {
        phoneNumber: "",
        email: "",
        website: "",
      },
    });

  const artistGenres = new Map(Object.entries(entity.genres || {}));
  const tableData: ResourceTableItem[] = [
    {
      label: artistGenres.size > 1 ? t("shared.genres") : t("shared.genre"),
      value: Array.from(artistGenres.values()),
      link: Array.from(artistGenres.keys()).map(
        (genreId) => `/genre/${encodeURIComponent(genreId)}`
      ),
    },
    {
      label: t("shared.dateOfBirth"),
      value: entity.dateOfBirth ? [entity.dateOfBirth.toString()] : [],
    },
    {
      label: t("shared.dateOfDeath"),
      value: entity.dateOfDeath ? [entity.dateOfDeath.toString()] : [],
    },
    {
      label: t("shared.phoneNumber"),
      value: entity.contactInfo!.phoneNumber
        ? [entity.contactInfo!.phoneNumber]
        : [],
      link: entity.contactInfo!.phoneNumber
        ? [`tel:${entity.contactInfo!.phoneNumber}`]
        : [],
    },
    {
      label: t("shared.email"),
      value: entity.contactInfo!.email ? [entity.contactInfo!.email] : [],
      link: entity.contactInfo!.email
        ? [`mailto:${entity.contactInfo!.email}`]
        : [],
    },
    {
      label: t("shared.webpage"),
      value: entity.contactInfo!.website ? [entity.contactInfo!.website] : [],
      link: [entity.contactInfo!.website!],
    },
  ].filter((item) => item.value.length > 0);

  return (
    <EntityPage
      entity={entity}
      entityType="artist"
      languageCode={languageCode}
      serverError={serverError}
      notFound={notFound}
    >
      {tableData.length > 0 && (
        <Section title={t("shared.information")}>
          <ResourceTable data={tableData} />
        </Section>
      )}
      {entity.contactInfo!.socialMedia &&
        Object.keys(entity.contactInfo!.socialMedia).length > 0 && (
          <SocialMediaSection socialMedia={entity.contactInfo!.socialMedia} />
        )}

      <CardListSection
        url={`${
          import.meta.env.VITE_API_URL_APP
        }/artworks/artistId?parentId=${encodeURIComponent(entity.id)}`}
        entityType="artwork"
        title={t("artistPage.artworksFromArtist")}
      />
      <GallerySection
        entityType="artist"
        imageDescriptions={entity.imageDescriptions}
        id={entity.id}
      />
    </EntityPage>
  );
};

export default ArtistPage;
