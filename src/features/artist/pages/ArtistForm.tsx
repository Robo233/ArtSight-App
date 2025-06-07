import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Artist,
  ImageDescription,
} from "../../../shared/types/types-dashboard";
import { fetchEntity } from "../../../shared/services/entityServiceDashboard";
import EntityForm from "../../../shared/components/EntityForm";
import Section from "../../../shared/components/Section";
import Input from "../../../shared/components/Input";
import MultiEntitySearchSelector from "../../../shared/components/MultiEntitySearchSelector";
import ImageDescriptionsSection from "../../../shared/components/ImageDescriptionsSection";
import { t } from "i18next";
import ContactInformationSection from "../../../shared/components/ContactInformationSection";

const ArtistForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [artist, setArtist] = useState<Artist>({
    id: "",
    name: {},
    description: {},
    dateOfBirth: "",
    dateOfDeath: "",
    genreIds: [],
    genreNames: [],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageDescriptions, setImageDescriptions] = useState<
    ImageDescription[]
  >([]);
  const [notFound, setNotFound] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [serverError, setServerError] = useState(false);

  const [selectedGenres, setSelectedGenres] = useState<
    { id: string; name: string }[]
  >([]);

  const handleGenreSelect = (genre: { id: string; name: string }) => {
    if (!selectedGenres.some((g) => g.id === genre.id)) {
      const updatedGenres = [...selectedGenres, genre];
      setSelectedGenres(updatedGenres);
      setArtist((prevArtist) => ({
        ...prevArtist,
        genreIds: updatedGenres.map((g) => g.id),
        genreNames: updatedGenres.map((g) => g.name),
      }));
    }
  };

  const handleGenreRemove = (genreId: string) => {
    const updatedGenres = selectedGenres.filter((g) => g.id !== genreId);
    setSelectedGenres(updatedGenres);
    setArtist((prevArtist) => ({
      ...prevArtist,
      genreIds: updatedGenres.map((g) => g.id),
      genreNames: updatedGenres.map((g) => g.name),
    }));
  };

  useEffect(() => {
    if (id) {
      fetchEntity("artist", id, setArtist, setNotFound, setServerError);
    }
  }, [id]);

  useEffect(() => {
    if (
      artist.genreIds &&
      artist.genreNames &&
      artist.genreIds.length > 0 &&
      selectedGenres.length === 0
    ) {
      const genres = artist.genreIds.map((id, index) => ({
        id,
        name: artist.genreNames![index] || "Unknown",
      }));
      setSelectedGenres(genres);
    }
  }, [artist, selectedGenres]);

  const handleInputChange = (field: keyof Artist, value: string | string[]) => {
    setArtist({ ...artist, [field]: value });
  };

  const addCustomFormData = (formData: FormData) => {
    imageFiles.forEach((file, index) => {
      formData.append(`ImageDescriptions[${index}].Image`, file);
    });
    imageDescriptions.forEach((descObj, index) => {
      Object.entries(descObj).forEach(([lang, desc]) => {
        formData.append(
          `ImageDescriptions[${index}].Descriptions[${lang}]`,
          desc || ""
        );
      });
    });
  };

  const handleSuccess = () => {
    setSubmissionSuccess(true);
    setTimeout(() => setSubmissionSuccess(false), 100);
  };

  return (
    <EntityForm
      entityType="artist"
      entity={artist}
      setEntity={setArtist}
      entityId={id}
      transformFormData={addCustomFormData}
      onSuccess={handleSuccess}
      notFound={notFound}
      serverError={serverError}
    >
      <ContactInformationSection
        contactInformation={artist.contactInfo || {}}
        onChange={(updatedContactInfo) =>
          setArtist({ ...artist, contactInfo: updatedContactInfo })
        }
        entityType="artist"
      />
      <Section title={t("shared.information")}>
        <Input
          label={t("shared.dateOfBirth")}
          type="text"
          value={artist.dateOfBirth || ""}
          onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
        />
        <Input
          label={t("shared.dateOfDeath")}
          type="text"
          value={artist.dateOfDeath || ""}
          onChange={(e) => handleInputChange("dateOfDeath", e.target.value)}
        />
      </Section>

      <Section
        title={t("shared.genres")}
        tooltipKey="artistForm.tooltip.genres"
      >
        <MultiEntitySearchSelector
          entityType="genre"
          selectedEntities={selectedGenres}
          onSelect={handleGenreSelect}
          onRemove={handleGenreRemove}
        />
      </Section>

      <ImageDescriptionsSection
        imageDescriptions={imageDescriptions}
        onChangeImageDescriptions={setImageDescriptions}
        imageFiles={imageFiles}
        onChangeImageFiles={setImageFiles}
        entityType="artist"
        id={id}
        submissionSuccess={submissionSuccess}
      />
    </EntityForm>
  );
};

export default ArtistForm;
