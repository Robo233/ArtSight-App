import React, { useEffect, useState } from "react";
import { Map, APIProvider } from "@vis.gl/react-google-maps";
import { Exhibition, Artwork } from "../../../shared/types/types-app";
import { useTheme } from "../../../shared/contexts/ThemeContext";
import { getLanguageCode } from "../../../i18n";
import HeaderWithCenteredText from "../../../shared/navigation/headers/HeaderWithCenteredText";
import { t } from "i18next";
import PageTitle from "../../../shared/components/PageTitle";
import MarkerWithInfoWindow from "../../../shared/components/MarkerWithInfoWindow";
import UserMarker from "../components/UserMarker";
import ServerErrorPage from "../../user/pages/ServerErrorPage";
import { getAppApiUrl } from "../../../shared/services/environment";

type LatLng = {
  lat: number;
  lng: number;
};

const center: LatLng = {
  lat: 45.618781,
  lng: 25.707053,
};

const Maps: React.FC = () => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const languageCode = getLanguageCode();
  const theme = useTheme();
  const [serverError, setServerError] = useState(false);

  useEffect(() => {
    fetch(`${getAppApiUrl()}/exhibitions/all/?languageCode=${languageCode}`)
      .then((response) => response.json())
      .then((data) => {
        setExhibitions(data.entities);
      })
      .catch((error) => {
        console.log("Failed to fetch exhibitions:", error);
        setServerError(true);
      });
  }, [languageCode]);

  useEffect(() => {
    fetch(`${getAppApiUrl()}/artworks/all/?languageCode=${languageCode}`)
      .then((response) => response.json())
      .then((data) => {
        setArtworks(data.entities);
      })
      .catch((error) => {
        console.log("Failed to fetch artworks:", error);
        setServerError(true);
      });
  }, [languageCode]);

  useEffect(() => {
    let watchId: number;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error watching user's location:", error);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    return () => {
      if (watchId && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  if (serverError) {
    return <ServerErrorPage />;
  }

  return (
    <div className="fixed">
      <HeaderWithCenteredText text={t("maps.lookAroundTheMap")} />
      <PageTitle title={`${t("shared.maps")}`} />
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
        <Map
          colorScheme={theme.theme === "light" ? "LIGHT" : "DARK"}
          style={{ width: "100vw", height: "100vh" }}
          defaultCenter={center}
          defaultZoom={15}
          gestureHandling="greedy"
          disableDefaultUI={true}
          mapId={import.meta.env.VITE_MAP_ID}
          reuseMaps={true}
        />
        {exhibitions.map((exhibition, index) => (
          <MarkerWithInfoWindow
            key={`exhibition-${index}`}
            id={exhibition.id}
            latitude={exhibition.latitude}
            longitude={exhibition.longitude}
            label={exhibition.name}
            address={exhibition.address}
            entityType="exhibition"
          />
        ))}
        {artworks.map((artwork, index) => (
          <MarkerWithInfoWindow
            key={`artwork-${index}`}
            id={artwork.id}
            latitude={artwork.latitude}
            longitude={artwork.longitude}
            label={artwork.name}
            entityType="artwork"
          />
        ))}
        {userLocation && (
          <UserMarker
            key="user-location"
            id="user-location"
            latitude={userLocation.lat}
            longitude={userLocation.lng}
            label={t("yourLocation")}
          />
        )}
      </APIProvider>
    </div>
  );
};

export default Maps;
