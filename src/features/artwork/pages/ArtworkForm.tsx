import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Artwork } from "../../../shared/types/types-dashboard";
import EntityForm from "../../../shared/components/EntityForm";
import Section from "../../../shared/components/Section";
import Input from "../../../shared/components/Input";
import ButtonWithLabel from "../../../shared/buttons/ButtonWithLabel";
import EntitySearchSelector from "../../../shared/components/EntitySearchSelector";
import MultiEntitySearchSelector from "../../../shared/components/MultiEntitySearchSelector";
import LocationPickerSection from "../../../shared/components/LocationPickerSection";
import { fetchEntity } from "../../../shared/services/entityServiceDashboard";
import { t } from "i18next";
import { getDashboardApiUrl } from "../../../shared/services/environment";

const ArtworkForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [artwork, setArtwork] = useState<Artwork>({
    id: "",
    name: {},
    description: {},
    medium: {},
    artistId: "",
    artistName: "",
    exhibitionId: "",
    exhibitionName: "",
    dimensions: "",
    genreIds: [],
    genreNames: [],
    latitude: undefined,
    longitude: undefined,
  });

  const [selectedArtist, setSelectedArtist] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedExhibition, setSelectedExhibition] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<
    { id: string; name: string }[]
  >([]);

  const [notFound, setNotFound] = useState(false);
  const [serverError, setServerError] = useState(false);

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loadingQr, setLoadingQr] = useState(false);
  const [qrError, setQrError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchEntity("artwork", id, setArtwork, setNotFound, setServerError);
    }
  }, [id]);

  useEffect(() => {
    if (artwork.genreIds && artwork.genreNames && artwork.genreIds.length > 0) {
      const genres = artwork.genreIds.map((id, index) => ({
        id,
        name: artwork.genreNames![index] || "Unknown",
      }));
      setSelectedGenres(genres);
    }
  }, [artwork]);

  useEffect(() => {
    if (artwork.artistId && artwork.artistName) {
      setSelectedArtist({ id: artwork.artistId, name: artwork.artistName });
    }
  }, [artwork.artistId, artwork.artistName]);

  useEffect(() => {
    if (artwork.exhibitionId && artwork.exhibitionName) {
      setSelectedExhibition({
        id: artwork.exhibitionId,
        name: artwork.exhibitionName,
      });
    }
  }, [artwork.exhibitionId, artwork.exhibitionName]);

  useEffect(() => {
    const newGenreIds = selectedGenres.map((g) => g.id);
    const newGenreNames = selectedGenres.map((g) => g.name);

    const idsAreEqual =
      JSON.stringify(artwork.genreIds) === JSON.stringify(newGenreIds);
    const namesAreEqual =
      JSON.stringify(artwork.genreNames) === JSON.stringify(newGenreNames);

    if (!idsAreEqual || !namesAreEqual) {
      setArtwork((prev) => ({
        ...prev,
        genreIds: newGenreIds,
        genreNames: newGenreNames,
      }));
    }
  }, [selectedGenres]);

  const handleArtistSelect = (artist: { id: string; name: string }) => {
    setArtwork((prev) => ({
      ...prev,
      artistId: artist.id,
      artistName: artist.name,
    }));
    setSelectedArtist(artist);
  };

  const handleExhibitionSelect = (exhibition: { id: string; name: string }) => {
    setArtwork((prev) => ({
      ...prev,
      exhibitionId: exhibition.id,
      exhibitionName: exhibition.name,
    }));
    setSelectedExhibition(exhibition);
  };

  const handleClearArtist = () => {
    setSelectedArtist(null);
    setArtwork((prev) => ({ ...prev, artistId: "", artistName: "" }));
  };

  const handleClearExhibition = () => {
    setSelectedExhibition(null);
    setArtwork((prev) => ({ ...prev, exhibitionId: "", exhibitionName: "" }));
  };

  const handleGenreSelect = (genre: { id: string; name: string }) => {
    if (!selectedGenres.some((g) => g.id === genre.id)) {
      setSelectedGenres((prev) => [...prev, genre]);
    }
  };

  const handleGenreRemove = (genreId: string) => {
    setSelectedGenres((prev) => prev.filter((g) => g.id !== genreId));
  };

  useEffect(() => {
    if (qrCode) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  }, [qrCode]);

  const handleInputChange = (
    field: keyof Artwork,
    value: string | string[]
  ) => {
    setArtwork({ ...artwork, [field]: value });
  };

  const handleGenerateQRCode = async () => {
    if (!id) return;

    setLoadingQr(true);
    setQrError(null);

    try {
      const authToken = localStorage.getItem("authToken");
      const response = await fetch(
        `${getDashboardApiUrl()}/artworks/qr/${id}`,
        {
          method: "POST",
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate QR Code");
      }

      const data = await response.json();
      setQrCode(`data:image/png;base64,${data.qrCodeBase64}`);
    } catch (error: any) {
      setQrError(error.message || "An error occurred while generating QR Code");
    } finally {
      setLoadingQr(false);
    }
  };

  const handleDownloadQRCode = () => {
    if (!qrCode || !id) return;
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = `artwork-qr-${id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <EntityForm
        entityType="artwork"
        entity={artwork}
        setEntity={setArtwork}
        entityId={id}
        translatableFields={["medium"]}
        bottomButtons={[
          <ButtonWithLabel
            key="generate"
            type="button"
            onClick={handleGenerateQRCode}
            label={
              loadingQr
                ? t("artworkForm.generating")
                : t("artworkForm.generateQR")
            }
          />,
        ]}
        notFound={notFound}
        serverError={serverError}
        externalLoading={loadingQr}
      >
        <Section
          title={t("shared.artist")}
          tooltipKey="artworkForm.tooltip.artist"
        >
          <EntitySearchSelector
            entityType="artist"
            onSelect={handleArtistSelect}
            onClear={handleClearArtist}
            selectedEntity={selectedArtist}
          />
        </Section>

        <Section title="Exhibition" tooltipKey="artworkForm.tooltip.exhibition">
          <EntitySearchSelector
            entityType="exhibition"
            onSelect={handleExhibitionSelect}
            onClear={handleClearExhibition}
            selectedEntity={selectedExhibition}
          />
        </Section>

        <LocationPickerSection
          initialPosition={
            artwork.latitude && artwork.longitude
              ? {
                  lat: artwork.latitude,
                  lng: artwork.longitude,
                }
              : null
          }
          onLocationSelect={(pos) => {
            artwork.latitude = pos?.lat;
            artwork.longitude = pos?.lng;
          }}
          entityType="artwork"
        />

        <Section
          title={t("shared.dimensions")}
          tooltipKey="artworkForm.tooltip.dimensions"
        >
          <Input
            placeholder={t("artworkForm.dimensionsPlaceholder")}
            type="text"
            value={artwork.dimensions || ""}
            onChange={(e) => handleInputChange("dimensions", e.target.value)}
          />
        </Section>

        <Section
          title={t("shared.genres")}
          tooltipKey="artworkForm.tooltip.genres"
        >
          <MultiEntitySearchSelector
            entityType="genre"
            selectedEntities={selectedGenres}
            onSelect={handleGenreSelect}
            onRemove={handleGenreRemove}
          />
        </Section>
      </EntityForm>

      {id && (
        <div className="max-w-[1200px] mx-auto pb-4">
          {qrError && (
            <p className="text-red-500 bottom-4 p-3 flex justify-center text-center">
              {qrError}
            </p>
          )}
          {qrCode && (
            <div className="mt-4 flex flex-col items-center">
              <img
                src={qrCode}
                alt="QR Code"
                className="w-40 h-40 border p-2 mb-4"
                draggable="false"
              />
              <ButtonWithLabel
                type="button"
                onClick={handleDownloadQRCode}
                label="Download QR Code"
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ArtworkForm;
