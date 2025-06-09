import React, { useState, useRef, useEffect } from "react";
import { t } from "i18next";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import {
  faEdit,
  faHeart as faRegularHeart,
} from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EntityType } from "../types/types-common";
import Button from "../buttons/Button";
import TextToSpeechSystem from "./TextToSpeechSystem";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import NavigationButton from "../buttons/NavigationButton";
import parseMarkup from "../utils/parseMarkup";
import { PageEntity } from "../types/types-app";
import {
  cancelExhibitionNotification,
  scheduleExhibitionNotification,
} from "../services/notificationService";
import { getAppApiUrl } from "../services/environment";

interface DescriptionProps {
  id: string;
  title: string;
  description?: string;
  entityType: EntityType;
  style?: React.CSSProperties;
  languageCode: string;
  isFavorite?: boolean;
  isOwner?: boolean;
  descriptionLanguageCode: string;
  entity: PageEntity;
}

const Description: React.FC<DescriptionProps> = ({
  id,
  title,
  description,
  entityType,
  style,
  languageCode,
  isFavorite,
  isOwner,
  descriptionLanguageCode,
  entity,
}) => {
  const MAX_COLLAPSED_HEIGHT = 200;

  const descriptionRef = useRef<HTMLDivElement>(null);

  const [expanded, setExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [isFavoriteState, setIsFavoriteState] = useState<boolean | undefined>(
    isFavorite
  );
  const [authToken, setAuthToken] = useState<string | null>("");

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    setAuthToken(localStorage.getItem("authToken"));
  }, []);

  useEffect(() => {
    setIsFavoriteState(isFavorite);
  }, [id, isFavorite]);

  useEffect(() => {
    const descEl = descriptionRef.current;

    if (descEl) {
      descEl.style.maxHeight = "none";
      const fullHeight = descEl.scrollHeight;

      if (fullHeight > MAX_COLLAPSED_HEIGHT) {
        setShowReadMore(true);
        if (!expanded) {
          descEl.style.maxHeight = `${MAX_COLLAPSED_HEIGHT}px`;
        }
      } else {
        setShowReadMore(false);
        descEl.style.maxHeight = "none";
      }
    }
  }, [description, expanded]);

  const toggleFavorite = async () => {
    const endpoint = isFavoriteState
      ? `${getAppApiUrl()}/favorites/remove/${id}/${entityType}`
      : `${getAppApiUrl()}/favorites/add/${id}/${entityType}`;
    const method = isFavoriteState ? "DELETE" : "POST";

    const response = await fetch(endpoint, {
      method: method,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.ok) {
      setIsFavoriteState(!isFavoriteState);

      if (!isFavoriteState && entityType === "exhibition" && entity) {
        scheduleExhibitionNotification(entity);
      } else if (isFavoriteState && entityType === "exhibition") {
        cancelExhibitionNotification(entity);
      }
    } else {
      console.error("Failed to update favorite status");
    }
  };

  const toggleExpand = () => {
    setExpanded((prev) => !prev);
    const descEl = descriptionRef.current;
    if (descEl) {
      if (!expanded) {
        descEl.style.maxHeight = "none";
      } else {
        descEl.style.maxHeight = `${MAX_COLLAPSED_HEIGHT}px`;
      }
    }
  };

  return (
    <>
      <div style={style} className="flex flex-col">
        <div className="flex items-center justify-between">
          <h1
            className="text-xl font-bold pt-4"
            style={{ marginRight: authToken ? "0.5rem" : "" }}
          >
            {title}
          </h1>
          <div className="flex space-x-2">
            {isOwner && (
              <NavigationButton
                className="top-3"
                activeClassName="text-text-hover"
                url={`${entityType}/${id}/edit`}
              >
                <FontAwesomeIcon
                  className="w-6 h-6"
                  icon={faEdit as IconProp}
                />
              </NavigationButton>
            )}
            {authToken && (
              <Button
                className={`top-3 ${isFavoriteState ? "text-primary" : ""}`}
                activeClassName={`${
                  isFavoriteState ? "text-primary-hover" : "text-text-hover"
                }`}
                onClick={toggleFavorite}
              >
                <FontAwesomeIcon
                  className="w-6 h-6"
                  icon={
                    isFavoriteState
                      ? (faSolidHeart as IconProp)
                      : (faRegularHeart as IconProp)
                  }
                />
              </Button>
            )}
          </div>
        </div>
      </div>
      {description && (
        <>
          <TextToSpeechSystem
            id={id}
            languageCode={languageCode}
            entityType={entityType}
            descriptionLanguageCode={descriptionLanguageCode}
          />
          <p
            ref={descriptionRef}
            className="overflow-hidden transition-all duration-300 ease-in-out"
            style={{
              maxHeight:
                !showReadMore || expanded
                  ? "none"
                  : `${MAX_COLLAPSED_HEIGHT}px`,
            }}
            dangerouslySetInnerHTML={{ __html: parseMarkup(description) }}
          />
          {showReadMore && (
            <Button
              onClick={toggleExpand}
              className="mb-2 font-bold bg-transparent text-primary"
              activeClassName="text-primary-hover"
            >
              {expanded ? t("description.readLess") : t("description.readMore")}
            </Button>
          )}
        </>
      )}
    </>
  );
};

export default Description;
