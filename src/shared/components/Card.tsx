import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import NavigationButton from "../buttons/NavigationButton";
import { EntityType } from "../types/types-common";
import { getAppApiUrl } from "../services/environment";

interface CardProps {
  id: string;
  title: string;
  entityType: EntityType;
  onClick?: () => void;
  highlightQuery?: string;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  entityType,
  onClick,
  highlightQuery,
}) => {
  const highlightText = (text: string, query?: string) => {
    if (!query?.trim()) return text;
    if (!text) return;

    const escapedQuery = escapeRegExp(query);
    const regex = new RegExp(`(${escapedQuery})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-background-opacity-contrast">
          {part}
        </span>
      ) : (
        <React.Fragment key={index}>{part}</React.Fragment>
      )
    );
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    e.currentTarget.src = "/default-image.jpg";
    e.currentTarget.onerror = null;
  };

  return (
    <NavigationButton
      url={onClick ? undefined : `/${entityType}/${id}`}
      onClick={onClick}
      key={id}
      className="flex items-center justify-between h-24 w-72 flex-shrink-0 bg-background rounded-lg cursor-pointer"
      style={{ border: "1px solid var(--color-text)" }}
      activeClassName="[&>div>div>span]:text-text-hover text-text-hover"
    >
      <div className="flex">
        <div className="flex-none w-[94px] h-[94px]">
          <img
            src={`${getAppApiUrl()}/media/${entityType}/${id}/images/MainImages/main_image_thumbnail.jpg`}
            alt={title}
            className="rounded-l-lg w-full h-full object-cover relative right-[0px]"
            onError={handleImageError}
            draggable="false"
          />
        </div>
        <div className="ml-3 flex flex-col justify-center items-start">
          <span
            className="transition-smooth text-md font-semibold break-words overflow-hidden cursor-pointer leading-5 mr-1 text-left"
            style={{
              overflowWrap: "anywhere",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 4,
            }}
          >
            {highlightText(title, highlightQuery)}
          </span>
        </div>
      </div>
      <FontAwesomeIcon icon={faChevronRight} className="mr-3" />
    </NavigationButton>
  );
};

export default Card;
