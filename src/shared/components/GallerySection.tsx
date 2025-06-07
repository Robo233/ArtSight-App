import React from "react";
import { t } from "i18next";
import Section from "./Section";
import { EntityType } from "../types/types-common";

interface GallerySectionProps {
  imageDescriptions: string[] | undefined;
  entityType: EntityType;
  id: string;
}

const GallerySection: React.FC<GallerySectionProps> = ({
  imageDescriptions,
  entityType,
  id,
}) => {
  return (
    imageDescriptions &&
    imageDescriptions.length > 0 && (
      <Section title={t("gallerySection.gallery")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {imageDescriptions.map((imageDescription, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <img
                src={`${
                  import.meta.env.VITE_API_URL_APP
                }/media/${entityType}/${id}/images/galleryimages/${
                  index + 1
                }.jpg`}
                className="w-full max-w-sm h-auto object-contain rounded-lg shadow-md"
                draggable="false"
              />
              <p className="text-sm text-center">{imageDescription}</p>
            </div>
          ))}
        </div>
      </Section>
    )
  );
};

export default GallerySection;
