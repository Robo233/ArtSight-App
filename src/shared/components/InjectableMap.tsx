import { APIProvider, Map as GoogleMap } from "@vis.gl/react-google-maps";
import { t } from "i18next";
import { useTheme } from "../contexts/ThemeContext";
import Section from "./Section";
import MarkerWithInfoWindow from "./MarkerWithInfoWindow";

interface InjectableMapProps {
  id: string;
  label: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  entityType: string;
}

const InjectableMap = ({
  id,
  label,
  address,
  latitude,
  longitude,
  entityType,
}: InjectableMapProps) => {
  const theme = useTheme();

  if (latitude === undefined || longitude === undefined) {
    return null;
  }

  return (
    <Section title={t("shared.maps")}>
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
        <GoogleMap
          colorScheme={theme.theme === "light" ? "LIGHT" : "DARK"}
          style={{ width: "100%", height: "400px" }}
          defaultCenter={{ lat: latitude, lng: longitude }}
          defaultZoom={15}
          gestureHandling="greedy"
          disableDefaultUI={true}
          mapId={import.meta.env.VITE_MAP_ID}
          reuseMaps={true}
        />
        <MarkerWithInfoWindow
          id={id}
          latitude={latitude}
          longitude={longitude}
          label={label}
          address={address}
          entityType={entityType}
        />
      </APIProvider>
    </Section>
  );
};

export default InjectableMap;
