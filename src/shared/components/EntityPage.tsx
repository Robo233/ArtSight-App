import React, { useRef, useState, useEffect } from "react";

import { Storage } from "@ionic/storage";
import { Capacitor } from "@capacitor/core";

import i18n from "../../i18n";
import Description from "./Description";
import HeaderWithSettings from "../navigation/headers/HeaderWithSettings";
import { HEADER_FOOTER_HEIGHT, LOADING_SPINNER_SIZE } from "../utils/constants";
import { EntityType } from "../types/types-common";
import LoadingSpinner from "./LoadingSpinner";
import { t } from "i18next";
import PageTitle from "./PageTitle";
import EntityNotFound from "./EntityNotFound";
import { PageEntity } from "../types/types-app";
import ServerErrorPage from "../../features/user/pages/ServerErrorPage";

interface EntityPageProps {
  entity: PageEntity;
  entityType: EntityType;
  style?: React.CSSProperties;
  languageCode: string;
  children?: React.ReactNode;
  serverError?: boolean;
  notFound?: boolean;
}

const EntityPage: React.FC<EntityPageProps> = ({
  entity,
  entityType,
  languageCode,
  children,
  serverError,
  notFound,
}) => {
  const storage = new Storage();
  const imageSrc = `${import.meta.env.VITE_API_URL_APP}/media/${entityType}/${
    entity.id
  }/images/MainImages/main_image.jpg`;
  const descriptionOffsetY = 200; // This ensures that if the screen's height is close to the image's height, then the description is still visbile. Otherwise, the image can occupy the whole screen

  const imageRef = useRef<HTMLImageElement>(null);

  const [imageHeight, setImageHeight] = useState<number>(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [descriptionTopPadding, setDescriptionTopPadding] = useState<number>(0);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      storage.create();
    }
  }, [i18n.language]);

  useEffect(() => {
    if (entity.id) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100); // A small delay is needed because for a short time, the previous entity's image is visible before the new one loads in case the user navigates from a page to another
    }
  }, [entity.id]);

  useEffect(() => {
    if (entity.mainImageAspectRatio) {
      const calculatedHeight = window.innerWidth / entity.mainImageAspectRatio;

      const adjustedHeight = Math.min(
        calculatedHeight,
        window.innerHeight - HEADER_FOOTER_HEIGHT * 2 - descriptionOffsetY
      );

      setImageHeight(adjustedHeight);
      setDescriptionTopPadding(
        adjustedHeight + HEADER_FOOTER_HEIGHT > window.innerHeight
          ? window.innerHeight - HEADER_FOOTER_HEIGHT - descriptionOffsetY
          : adjustedHeight + HEADER_FOOTER_HEIGHT
      );
    }
  }, [entity.mainImageAspectRatio]);

  const handleImageLoad = () => {
    if (imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      setImageHeight(rect.height);
    }
    setIsImageLoaded(true);
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = "/default-image.jpg";
    e.currentTarget.onerror = null;
  };

  if (serverError) {
    return <ServerErrorPage />;
  }

  if (notFound) {
    return <EntityNotFound entityType={entityType} />;
  }

  return (
    <>
      <HeaderWithSettings />
      <PageTitle title={`${t(`shared.${entityType}s`)} - ${entity.name}`} />

      {entity.id ? (
        <div>
          <div
            className="fixed w-full flex justify-center items-center "
            style={{
              top: `${HEADER_FOOTER_HEIGHT}px`,
              height: "auto",
            }}
          >
            {!isImageLoaded && (
              <div
                className="absolute"
                style={{
                  paddingTop: `${
                    descriptionTopPadding - LOADING_SPINNER_SIZE / 2
                  }px`,
                }}
              >
                <LoadingSpinner />
              </div>
            )}

            <img
              ref={imageRef}
              onLoad={handleImageLoad}
              onError={handleImageError}
              src={imageSrc}
              style={{ height: imageHeight ? `${imageHeight}px` : "auto" }}
              draggable="false"
            />
          </div>
          {descriptionTopPadding && (
            <div
              style={{
                marginTop: `${descriptionTopPadding}px`,
              }}
              className="bg-background-opacity backdrop-blur-lg  rounded-t-[2rem] pb-1 min-h-screen mx-auto h-full"
            >
              <div className="responsive-container ">
                <Description
                  id={entity.id}
                  title={entity.name}
                  description={entity.description}
                  entityType={entityType}
                  languageCode={languageCode}
                  isFavorite={entity.isFavorite}
                  isOwner={entity.isOwner}
                  descriptionLanguageCode={entity.descriptionLanguageCode}
                  entity={entity}
                />
                {children}
              </div>
            </div>
          )}
        </div>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
};

export default EntityPage;
