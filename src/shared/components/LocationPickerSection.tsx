import React, { useState, useEffect } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { useTheme } from "../contexts/ThemeContext";
import ButtonWithLabel from "../buttons/ButtonWithLabel";
import Section from "./Section";
import MarkerWithInfoWindow from "./MarkerWithInfoWindow";
import { t } from "i18next";

interface LocationPickerSectionProps {
  initialPosition?: { lat: number; lng: number } | null;
  onLocationSelect: (position: { lat: number; lng: number } | null) => void;
  height?: string;
  width?: string;
  markerAddress?: string;
  entityType: string;
}

const LocationPickerSection: React.FC<LocationPickerSectionProps> = ({
  initialPosition = null,
  onLocationSelect,
  height = "400px",
  width = "100%",
  markerAddress = "",
  entityType,
}) => {
  const theme = useTheme();

  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(initialPosition);
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [hasCleared, setHasCleared] = useState(false);

  useEffect(() => {
    if (!hasUserInteracted && !hasCleared) {
      setMarkerPosition(initialPosition);
    }
  }, [initialPosition, hasUserInteracted, hasCleared]);

  const handleMapClick = (e: any) => {
    if (!isEditingLocation) return;
    const latLng = e.detail.latLng;
    if (!latLng) return;
    const newPosition = { lat: latLng.lat, lng: latLng.lng };
    setMarkerPosition(newPosition);
    setHasUserInteracted(true);
    onLocationSelect(newPosition);
  };

  const handleClearLocation = () => {
    setMarkerPosition(null);
    setHasUserInteracted(true);
    setHasCleared(true);
    onLocationSelect(null);
  };

  const mapKey =
    !hasUserInteracted && markerPosition
      ? `${markerPosition.lat}_${markerPosition.lng}`
      : "static";

  return (
    <Section
      title={t("locationPickerSection.location")}
      tooltipKey={`${entityType}Form.tooltip.location`}
    >
      {markerPosition && !isEditingLocation && (
        <div className="text-center space-y-2">
          <p className="text-text-hover">
            {t("locationPickerSection.selectedCoordinates")}
            {markerPosition.lat}, {markerPosition.lng}
          </p>
          <div className="flex flex-col justify-center items-center space-y-2">
            <ButtonWithLabel
              type="button"
              label={t("locationPickerSection.updateLocation")}
              onClick={() => setIsEditingLocation(true)}
            />
            <ButtonWithLabel
              type="button"
              label={t("locationPickerSection.clearLocation")}
              onClick={handleClearLocation}
            />
          </div>
        </div>
      )}

      {isEditingLocation && (
        <div className="text-center">
          <p>{t("locationPickerSection.selectLocation")}</p>
        </div>
      )}

      {markerPosition === null && !isEditingLocation ? (
        <>
          <p className="text-center">
            {t("locationPickerSection.noLocationSet")}
          </p>
          <div className="flex justify-center">
            <ButtonWithLabel
              type="button"
              label={t("locationPickerSection.addLocation")}
              onClick={() => setIsEditingLocation(true)}
            />
          </div>
        </>
      ) : (
        <div style={{ width, height }}>
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
            <Map
              colorScheme={theme.theme === "light" ? "LIGHT" : "DARK"}
              key={mapKey}
              defaultCenter={
                markerPosition || {
                  lat: 45.627686877660395,
                  lng: 25.6678743958855,
                }
              }
              defaultZoom={15}
              gestureHandling="greedy"
              disableDefaultUI
              mapId={import.meta.env.VITE_MAP_ID}
              reuseMaps
              onClick={handleMapClick}
            />
            {markerPosition && (
              <MarkerWithInfoWindow
                key={`marker_${markerPosition.lat}_${markerPosition.lng}`}
                latitude={markerPosition.lat}
                longitude={markerPosition.lng}
                address={markerAddress}
                entityType={entityType}
              />
            )}
          </APIProvider>
        </div>
      )}

      {isEditingLocation && (
        <div className="text-center" style={{ marginTop: "1rem" }}>
          {markerPosition ? (
            <ButtonWithLabel
              type="button"
              label={t("locationPickerSection.confirmLocation")}
              onClick={() => setIsEditingLocation(false)}
            />
          ) : (
            <></>
          )}
        </div>
      )}
    </Section>
  );
};

export default LocationPickerSection;
