import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ArtworkDetail } from "../../../shared/types/types-dashboard";
import EntityForm from "../../../shared/components/EntityForm";
import Section from "../../../shared/components/Section";
import EntitySearchSelector from "../../../shared/components/EntitySearchSelector";
import { fetchEntity } from "../../../shared/services/entityServiceDashboard";

const ArtworkDetailForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [artworkDetail, setArtworkDetail] = useState<ArtworkDetail>({
    id: "",
    name: {},
    description: {},
    artworkId: "",
    artworkName: "",
  });
  const [notFound, setNotFound] = useState(false);
  const [serverError, setServerError] = useState(false);

  const [selectedArtwork, setSelectedArtwork] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleArtworkSelect = (artwork: { id: string; name: string }) => {
    setArtworkDetail((prev) => ({
      ...prev,
      artworkId: artwork.id,
      artworkName: artwork.name,
    }));
    setSelectedArtwork(artwork);
  };

  const handleClearArtwork = () => {
    setSelectedArtwork(null);
    setArtworkDetail((prev) => ({ ...prev, artworkId: "", artworkName: "" }));
  };

  useEffect(() => {
    if (id) {
      fetchEntity(
        "artworkDetail",
        id,
        setArtworkDetail,
        setNotFound,
        setServerError
      );
    }
  }, [id]);

  useEffect(() => {
    if (artworkDetail.artworkId && artworkDetail.artworkName) {
      setSelectedArtwork({
        id: artworkDetail.artworkId,
        name: artworkDetail.artworkName,
      });
    }
  }, [artworkDetail]);

  return (
    <EntityForm
      entityType="artworkDetail"
      entity={artworkDetail}
      setEntity={setArtworkDetail}
      entityId={id}
      notFound={notFound}
      serverError={serverError}
    >
      <Section title="Artwork" tooltipKey="artworkDetailForm.tooltip.artwork">
        <EntitySearchSelector
          entityType="artwork"
          onSelect={handleArtworkSelect}
          onClear={handleClearArtwork}
          selectedEntity={selectedArtwork}
        />
      </Section>
    </EntityForm>
  );
};

export default ArtworkDetailForm;
