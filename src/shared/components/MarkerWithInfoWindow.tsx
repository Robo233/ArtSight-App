import { useCallback, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faLandmark } from "@fortawesome/free-solid-svg-icons";
import {
  AdvancedMarker,
  useAdvancedMarkerRef,
  InfoWindow,
  Pin,
} from "@vis.gl/react-google-maps";
import { t } from "i18next";
import StyledLink from "../buttons/StyledLink";

interface MarkerWithInfoWindowProps {
  id?: string;
  latitude: number | undefined;
  longitude: number | undefined;
  label?: string;
  address?: string | undefined;
  entityType: string;
}

const MarkerWithInfoWindow: React.FC<MarkerWithInfoWindowProps> = ({
  id,
  latitude,
  longitude,
  label,
  address,
  entityType,
}) => {
  const [markerRef, marker] = useAdvancedMarkerRef();

  const [infoWindowShown, setInfoWindowShown] = useState(false);

  const handleMarkerClick = useCallback(
    () => setInfoWindowShown((isShown) => !isShown),
    []
  );

  const handleClose = useCallback(() => setInfoWindowShown(false), []);

  const icon = entityType === "artwork" ? faImage : faLandmark;

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{
          lat: Number(latitude),
          lng: Number(longitude),
        }}
        onClick={id ? handleMarkerClick : undefined}
      >
        <Pin
          background={"var(--color-primary)"}
          borderColor={"var(--color-primary)"}
          glyphColor={"var(--color-primary)"}
        >
          <div className="flex items-center">
            <FontAwesomeIcon icon={icon} className="text-lg text-text" />
            <span className="absolute w-36 ml-7 text-lg">{label}</span>
          </div>
        </Pin>
      </AdvancedMarker>

      {infoWindowShown && (
        <InfoWindow
          headerContent={<h2 className="text-black">{label}</h2>}
          ariaLabel={label}
          anchor={marker}
          onClose={handleClose}
        >
          <div className="flex flex-col space-y-1">
            <span className="text-black">{address}</span>
            <StyledLink
              url={`/${entityType}/${id}`}
              label={t("markerWithInfoWindow.findOutMore")}
            />
          </div>
        </InfoWindow>
      )}
    </>
  );
};

export default MarkerWithInfoWindow;
