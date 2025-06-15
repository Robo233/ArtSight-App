import { useParams } from "react-router-dom";
import {
  Exhibition,
  ExhibitionSchedule,
} from "../../../shared/types/types-app";
import EntityPage from "../../../shared/components/EntityPage";
import ResourceTable from "../../../shared/components/ResourceTable";
import Section from "../../../shared/components/Section";
import { t } from "i18next";
import CardListSection from "../../../shared/components/CardListSection";
import GallerySection from "../../../shared/components/GallerySection";
import SocialMediaSection from "../../../shared/components/SocialMediaSection";
import InjectableMap from "../../../shared/components/InjectableMap";
import { useEntityDataApp } from "../../../shared/hooks/useEntityDataApp";
import { getAppApiUrl } from "../../../shared/services/environment";

interface ResourceTableItem {
  label: string;
  value: string[];
  link?: string[];
}

const ExhibitionPage = () => {
  const { id } = useParams<{ id: string }>();

  const { entity, languageCode, notFound, serverError } =
    useEntityDataApp<Exhibition>("exhibition", id, {
      id: "",
      address: "",
      isFavorite: false,
      name: "",
      descriptionLanguageCode: "",
      contactInfo: {
        phoneNumber: "",
        email: "",
        website: "",
      },
    });

  const formatScheduleEntries = (schedule: ExhibitionSchedule): string[] => {
    if (schedule.scheduleType === "Fixed") {
      return schedule.fixedEntries.map((entry) => {
        if (entry.isNonStop)
          return `${t(`shared.${entry.day}`)}: ${t("shared.nonStop")}`;
        return `${t(`shared.${entry.day}`)}: ${entry.startTime} - ${
          entry.endTime
        }`;
      });
    }

    return schedule.customEntries.map((entry) => {
      if (entry.isNonStop) return `${entry.date}: ${t("shared.nonStop")}`;
      return `${entry.date}: ${entry.startTime} - ${entry.endTime}`;
    });
  };

  const exhibitionGenres = new Map(Object.entries(entity.genres || {}));

  const tableData: ResourceTableItem[] = [
    {
      label: exhibitionGenres.size > 1 ? t("shared.genres") : t("shared.genre"),
      value: Array.from(exhibitionGenres.values()),
      link: Array.from(exhibitionGenres.keys()).map(
        (genreId) => `/genre/${encodeURIComponent(genreId)}`
      ),
    },
    {
      label: t("shared.address"),
      value: entity.address ? [entity.address] : [],
    },
    {
      label: t("exhibitionPage.schedule"),
      value: entity.schedule ? formatScheduleEntries(entity.schedule) : [],
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
      entityType="exhibition"
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

      <InjectableMap
        id={entity.id}
        label={entity.name}
        address={entity.address}
        latitude={entity.latitude}
        longitude={entity.longitude}
        entityType="exhibition"
      />

      <CardListSection
        url={`${getAppApiUrl()}/artworks/exhibitionId?parentId=${encodeURIComponent(
          id
        )}`}
        entityType="artwork"
        title={t("exhibitionPage.artworksFromExhibition")}
      />

      <GallerySection
        entityType="exhibition"
        imageDescriptions={entity.imageDescriptions}
        id={entity.id}
      />
    </EntityPage>
  );
};

export default ExhibitionPage;
