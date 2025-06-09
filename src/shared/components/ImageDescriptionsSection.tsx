import React, { useContext, useEffect, useRef, useState } from "react";
import Section from "./Section";
import Input from "./Input";
import ImageWithTrash from "./ImageWithTrash";
import { ImageDescription } from "../types/types-dashboard";
import { deleteImage } from "../services/entityServiceDashboard";
import { LanguageContext } from "../contexts/LanguageContext";
import ButtonWithLabel from "../buttons/ButtonWithLabel";
import { t } from "i18next";
import { getAppApiUrl } from "../services/environment";

interface ImageDescriptionsSectionProps {
  imageDescriptions: ImageDescription[];
  onChangeImageDescriptions: (updated: ImageDescription[]) => void;
  imageFiles: File[];
  onChangeImageFiles: (updated: File[]) => void;
  entityType: string;
  id?: string;
  submissionSuccess: boolean;
}

const ImageDescriptionsSection: React.FC<ImageDescriptionsSectionProps> = ({
  imageDescriptions,
  onChangeImageDescriptions,
  imageFiles,
  onChangeImageFiles,
  entityType,
  id,
  submissionSuccess,
}) => {
  const { existingLanguages } = useContext(LanguageContext);
  const inputRefs = useRef<(HTMLInputElement | HTMLTextAreaElement | null)[]>(
    []
  );
  const [imageURLs, setImageURLs] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      fetchImages();
    }
  }, [id]);

  useEffect(() => {
    if (submissionSuccess) {
      onChangeImageFiles([]);

      fetchImages();
      inputRefs.current.forEach((ref) => {
        if (ref) ref.value = "";
      });
    }
  }, [submissionSuccess]);

  const fetchImages = async () => {
    const timestamp = new Date().getTime();

    const fetchImagePromises = imageDescriptions.map(async (_, idx) => {
      const index = idx + 1;
      const imageUrl = `${getAppApiUrl()}/media/${entityType}/${id}/Images/GalleryImages/${index}.jpg?timestamp=${timestamp}`;
      const imageResponse = await fetch(imageUrl);
      return imageResponse.ok ? imageUrl : "";
    });

    const fetchedUrls = await Promise.all(fetchImagePromises);
    setImageURLs(fetchedUrls);
  };

  useEffect(() => {
    if (id && imageDescriptions.length > 0) {
      fetchImages();
    }
  }, [id, imageDescriptions]);

  const addImageItem = () => {
    onChangeImageFiles([...imageFiles, undefined as unknown as File]);

    const newDescriptionObj: ImageDescription = {};
    const languages = Array.from(new Set(["en", ...existingLanguages]));
    languages.forEach((lang) => {
      newDescriptionObj[lang] = "";
    });

    onChangeImageDescriptions([...imageDescriptions, newDescriptionObj]);
  };

  const removeImage = (index: number) => {
    const newFiles = [...imageFiles];
    newFiles[index] = undefined as unknown as File;
    onChangeImageFiles(newFiles);

    const ref = inputRefs.current[index];

    if (id && ref && ref.value === "") {
      deleteImage(entityType, id, `GalleryImages/${index + 1}.jpg`);
    }

    if (ref) {
      ref.value = "";
    }

    setImageURLs((prevURLs) => {
      const newURLs = [...prevURLs];
      newURLs[index] = "";
      return newURLs;
    });
  };

  const removeImageItem = (index: number) => {
    removeImage(index);

    const newDescriptions = [...imageDescriptions];
    newDescriptions.splice(index, 1);
    onChangeImageDescriptions(newDescriptions);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | null>,
    index: number
  ) => {
    if (e.target instanceof HTMLInputElement && e.target.files) {
      const file = e.target.files?.[0];
      if (!file) return;

      const updatedFiles = [...imageFiles];
      updatedFiles[index] = file;
      onChangeImageFiles(updatedFiles);

      const updatedImageURLs = [...imageURLs];
      updatedImageURLs[index] = URL.createObjectURL(file);
      setImageURLs(updatedImageURLs);
    }
  };

  const handleDescriptionChange = (
    imageIndex: number,
    language: string,
    newDesc: string
  ) => {
    const updated = [...imageDescriptions];
    const updatedDescriptionObj = { ...updated[imageIndex] };
    updatedDescriptionObj[language] = newDesc;
    updated[imageIndex] = updatedDescriptionObj;

    onChangeImageDescriptions(updated);
  };

  return (
    <Section
      title={t("imageDescriptionsSection.imageDescriptionsSection")}
      tooltipKey={`${entityType}Form.tooltip.imageDescriptions`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
        {imageDescriptions.map((descObj, index) => {
          const combinedLanguages = Array.from(
            new Set([...existingLanguages, ...Object.keys(descObj)])
          );
          return (
            <div
              key={index}
              className="rounded-md border-[1px] border-text p-3"
            >
              <div className="flex justify-center mb-4">
                {imageURLs[index] && (
                  <ImageWithTrash
                    imageURL={imageURLs[index]}
                    deleteImage={() => removeImage(index)}
                  />
                )}
              </div>
              <div className="flex justify-center mb-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, index)}
                  label=""
                  ref={(el) => (inputRefs.current[index] = el)}
                />
              </div>
              <div style={{ marginTop: "1rem" }}>
                {combinedLanguages.map((lang) => (
                  <div
                    key={lang}
                    style={{ marginBottom: "1rem" }}
                    className="flex justify-center"
                  >
                    <Input
                      type="textarea"
                      value={descObj[lang] || ""}
                      onChange={(e) =>
                        handleDescriptionChange(index, lang, e.target.value)
                      }
                      label={`${t(`shared.description`)} (${lang})`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-center mb-4">
                <ButtonWithLabel
                  type="button"
                  onClick={() => removeImageItem(index)}
                  label={t("shared.remove")}
                />
              </div>
            </div>
          );
        })}
      </div>

      <ButtonWithLabel
        type="button"
        onClick={addImageItem}
        label={t("imageDescriptionsSection.addImage")}
      />
    </Section>
  );
};

export default ImageDescriptionsSection;
