import React, { useState, useRef, useEffect, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import { EntityType } from "../types/types-common";
import Section from "./Section";
import Input from "./Input";
import ImageWithTrash from "./ImageWithTrash";
import { deleteEntity, deleteImage } from "../services/entityServiceDashboard";
import HeaderWithSettings from "../navigation/headers/HeaderWithSettings";
import CustomDropdown from "./CustomDropdown";
import { PageEntity } from "../types/types-dashboard";
import { getLanguageCode } from "../../i18n";
import PageTitle from "./PageTitle";
import { t } from "i18next";
import ButtonWithLabel from "../buttons/ButtonWithLabel";
import { LanguageContext } from "../contexts/LanguageContext";
import capitalizeFirstLetter from "../utils/capitalizeFirstLetter";
import {
  HEADER_FOOTER_HEIGHT,
  HEADER_FOOTER_VERTICAL_OFFSET,
} from "../utils/constants";
import EntityNotFound from "./EntityNotFound";
import ServerErrorPage from "../../features/user/pages/ServerErrorPage";
import Tooltip from "./Tooltip";
import LoadingSpinner from "./LoadingSpinner";
import { getDashboardApiUrl } from "../services/environment";

interface EntityFormProps<T extends PageEntity> {
  entityType: EntityType;
  entity: T;
  setEntity: React.Dispatch<React.SetStateAction<T>>;
  entityId?: string;
  children: React.ReactNode;
  transformFormData?: (formData: FormData) => void;
  onSuccess?: () => void;
  translatableFields?: string[];
  externalLoading?: boolean;
  bottomButtons?: React.ReactNode[];
  serverError?: boolean;
  notFound?: boolean;
}

function EntityForm<T extends PageEntity>({
  entityType,
  entity,
  setEntity,
  entityId,
  children,
  transformFormData,
  onSuccess,
  translatableFields = [],
  externalLoading,
  bottomButtons,
  serverError,
  notFound,
}: EntityFormProps<T>) {
  const history = useHistory();
  const defaultLanguages = ["en", "ro"];

  const [isLanguageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitMessageType, setSubmitMessageType] = useState<
    "success" | "error"
  >("success");
  const [mainImageURL, setMainImageURL] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  const allTranslatableFields = ["name", "description", ...translatableFields];

  const existingLanguages = Array.from(
    new Set<string>(
      allTranslatableFields.flatMap((field) => {
        const fieldVal = (entity as any)[field];
        if (Array.isArray(fieldVal)) {
          return fieldVal.flatMap((item: any) =>
            item && typeof item === "object" ? Object.keys(item) : []
          );
        } else if (fieldVal && typeof fieldVal === "object") {
          return Object.keys(fieldVal);
        }
        return [];
      })
    )
  );

  const addLanguage = useCallback(
    (lang: string) => {
      setEntity((prev) => {
        const updated: any = { ...prev };
        allTranslatableFields.forEach((field) => {
          const current = updated[field] || {};
          updated[field] = {
            ...current,
            [lang]: "",
          };
        });
        return updated;
      });
    },
    [allTranslatableFields, setEntity]
  );

  const removeLanguage = useCallback(
    (lang: string) => {
      setEntity((prev) => {
        const updated: any = { ...prev };
        allTranslatableFields.forEach((field) => {
          const { [lang]: _, ...rest } = updated[field] || {};
          updated[field] = rest;
        });
        return updated;
      });
    },
    [allTranslatableFields, setEntity]
  );

  const languageContextValue = {
    existingLanguages,
    addLanguage,
    removeLanguage,
  };

  useEffect(() => {
    if (!entityId) return;
    const fetchMainImage = async () => {
      try {
        const timestamp = new Date().getTime();
        const imageUrl = `${getDashboardApiUrl()}/media/${entityType}/${entityId}/Images/MainImages/main_image.jpg?timestamp=${timestamp}`;
        const response = await fetch(imageUrl);
        if (response.ok) {
          setMainImageURL(imageUrl);
        }
      } catch (error) {
        console.error("Error fetching main image:", error);
      }
    };
    fetchMainImage();
  }, [entityId, entityType]);

  useEffect(() => {
    const userLang = getLanguageCode();
    if (!existingLanguages.includes(userLang)) {
      addLanguage(userLang);
    }
  }, []);

  useEffect(() => {
    if (submitMessage) {
      const timerId = setTimeout(() => {
        setSubmitMessage("");
      }, 3000);
      return () => clearTimeout(timerId);
    }
  }, [submitMessage]);

  const handleTranslationChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
    lang: string
  ) => {
    const { value } = event.target;
    setEntity((prev) => ({
      ...prev,
      [field]: {
        ...(prev as any)[field],
        [lang]: value,
      },
    }));
  };

  const handleMainImageUpload = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target instanceof HTMLInputElement && e.target.files) {
      const file = e.target.files[0];
      if (file) {
        setMainImage(file);
        setMainImageURL(URL.createObjectURL(file));
      }
    }
  };

  const clearMainImageInput = () => {
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = "";
    }
    setMainImage(null);
  };

  const deleteMainImage = () => {
    if (
      entityId &&
      mainImageInputRef.current &&
      mainImageInputRef.current.value == "" // This is needed, otherwise an image can de deleted from the server, even though we were trying to delete a local image
    ) {
      deleteImage(entityType, entityId, "MainImages/main_image.jpg");
    }
    clearMainImageInput();
    setMainImageURL(null);
  };

  function mapObjectToFormData(
    data: Record<string, any>,
    formData = new FormData(),
    parentKey = ""
  ): FormData {
    for (const key in data) {
      const value = data[key];
      const formKey = parentKey ? `${parentKey}[${key}]` : key;

      // Skip undefined values entirely
      if (value === undefined) {
        continue;
      }

      // Convert null to an empty string and append
      if (value === null) {
        formData.append(formKey, "");
        continue;
      }

      if (value instanceof File) {
        formData.append(formKey, value);
        continue;
      }

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          const arrayKey = `${formKey}[${index}]`;

          if (item === null || item === undefined) {
            formData.append(arrayKey, "");
            return;
          }

          if (item instanceof File) {
            formData.append(arrayKey, item);
            return;
          }

          if (typeof item === "object") {
            if (Object.keys(item).length === 0) {
              formData.append(arrayKey, "");
            } else {
              mapObjectToFormData(item, formData, arrayKey);
            }
            return;
          }

          formData.append(arrayKey, item);
        });
        continue;
      }

      if (typeof value === "object") {
        if (Object.keys(value).length === 0) {
          formData.append(formKey, "");
        } else {
          mapObjectToFormData(value, formData, formKey);
        }
        continue;
      }

      formData.append(formKey, value);
    }

    return formData;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitMessage("");
    setIsSubmitting(true);

    let formData = new FormData();
    formData = mapObjectToFormData(entity, formData);

    if (mainImage) {
      formData.append("MainImage", mainImage);
    }

    if (transformFormData) {
      transformFormData(formData);
    }
    const authToken = localStorage.getItem("authToken");
    try {
      const response = await fetch(
        `${getDashboardApiUrl()}/${entityType}s/upsert`,
        {
          method: "POST",
          body: formData,
          headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          const errors = Object.values(errorData.errors) as string[][];
          const firstError = errors.flat()[0];
          throw new Error(firstError || `Failed to submit ${entityType}.`);
        } else {
          throw new Error(`Failed to submit ${entityType}.`);
        }
      }
      const data = await response.json();
      setSubmitMessageType("success");
      setSubmitMessage(
        `${capitalizeFirstLetter(entityType)} submitted successfully`
      );

      if (onSuccess) {
        onSuccess();
        clearMainImageInput();
      }
      history.push(`/${entityType}/${data.id}/edit`);
    } catch (error: any) {
      console.error("Error submitting entity:", error);
      setSubmitMessageType("error");
      setSubmitMessage(error.message || `Failed to submit ${entityType}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEntity = async () => {
    if (!entityId) return;
    try {
      const response = await deleteEntity(entityType, entityId);
      if (response.ok) {
        history.push(`/yours`);
      } else {
        throw new Error("Failed to delete entity.");
      }
    } catch (error: any) {
      console.error("Error deleting entity:", error);
      setSubmitMessageType("error");
      setSubmitMessage(error.message || "Failed to delete entity.");
    }
  };

  const pageTitle = !entityId
    ? `${t(`shared.${entityType}s`)} - ${t("entityForm.new")}`
    : entity.name[getLanguageCode()] === undefined
    ? t(`shared.${entityType}s`)
    : `${t(`shared.${entityType}s`)} - ${entity.name[getLanguageCode()]}`;

  if (serverError) {
    return <ServerErrorPage />;
  }

  if (notFound) {
    return <EntityNotFound entityType={entityType} />;
  }

  return (
    <LanguageContext.Provider value={languageContextValue}>
      <HeaderWithSettings />
      <PageTitle title={pageTitle} />
      {entity.id || !entityId ? (
        <>
          <div
            className="responsive-container"
            style={{
              paddingTop: `${
                HEADER_FOOTER_HEIGHT + HEADER_FOOTER_VERTICAL_OFFSET
              }px`,
            }}
          >
            <form onSubmit={handleSubmit}>
              <Section
                title={t("entityForm.mainImage")}
                tooltipKey={`${entityType}Form.tooltip.mainImage`}
              >
                {mainImageURL && (
                  <ImageWithTrash
                    imageURL={mainImageURL}
                    deleteImage={deleteMainImage}
                  />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  ref={mainImageInputRef}
                  onChange={handleMainImageUpload}
                  label=""
                />
              </Section>
              <Section />
              <div className="relative flex justify-center mb-[46px]">
                <div
                  className="flex justify-center items-center"
                  ref={dropdownContainerRef}
                >
                  {/* Both divs are needed in order for the dropdown to open and close correctly */}
                  <ButtonWithLabel
                    onClick={() =>
                      setLanguageDropdownOpen(!isLanguageDropdownOpen)
                    }
                    type="button"
                    label={t("entityForm.languages")}
                  />
                  <Tooltip tooltipKey={"shared.tooltip.languages"} />
                  <CustomDropdown
                    options={defaultLanguages.map((lang) => ({
                      name: lang.toUpperCase(),
                      value: lang,
                      selected: existingLanguages.includes(lang),
                    }))}
                    onOptionClick={(option) => {
                      const selectedLang = option.value;
                      if (selectedLang) {
                        if (existingLanguages.includes(selectedLang)) {
                          removeLanguage(selectedLang);
                        } else {
                          addLanguage(selectedLang);
                        }
                      }
                    }}
                    dropdownDirection="down"
                    isOpen={isLanguageDropdownOpen}
                    onClose={() => setLanguageDropdownOpen(false)}
                    containerRef={dropdownContainerRef}
                  />
                </div>
              </div>

              <div className="grid gap-4">
                {existingLanguages.map((lang) => (
                  <Section key={lang} title={lang.toUpperCase()}>
                    {allTranslatableFields.map((field) => (
                      <React.Fragment key={`${lang}-${field}`}>
                        <Input
                          label={`${t(`shared.${field}`)} (${lang})`}
                          type={field === "description" ? "textarea" : "text"}
                          value={(entity as any)[field]?.[lang] || ""}
                          onChange={(e) =>
                            handleTranslationChange(e, field, lang)
                          }
                          width={
                            field === "description" && innerWidth >= 768
                              ? "600px"
                              : "280px"
                          }
                          height={field === "description" ? "600px" : "auto"}
                          tooltipKey={`${entityType}Form.tooltip.${field}`}
                        />
                      </React.Fragment>
                    ))}
                  </Section>
                ))}
                {children}
              </div>

              <Section title={t("entityForm.formActions")}>
                <div className="mt-4 px-2 flex flex-col sm:flex-row justify-center items-center gap-4">
                  <ButtonWithLabel
                    type="submit"
                    label={t("entityForm.submit")}
                  />
                  {entityId && (
                    <>
                      <ButtonWithLabel
                        type="button"
                        label={t("entityForm.delete")}
                        onClick={handleDeleteEntity}
                      />
                      <Link to={`/${entityType}/${entityId}`}>
                        <ButtonWithLabel label={t("entityForm.viewInApp")} />
                      </Link>
                      {bottomButtons &&
                        bottomButtons.map((button, idx) => (
                          <React.Fragment key={idx}>{button}</React.Fragment>
                        ))}
                    </>
                  )}
                </div>
                {(isSubmitting || externalLoading) && (
                  <div className="p-3 flex items-center justify-center">
                    <div className="border-4 border-t-4 border-t-primary rounded-full w-16 h-16 animate-spin"></div>
                  </div>
                )}
                {!(isSubmitting || externalLoading) && submitMessage && (
                  <span
                    className={`bottom-4 p-3 flex justify-center text-center ${
                      submitMessageType === "success"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {submitMessage}
                  </span>
                )}
              </Section>
            </form>
          </div>
        </>
      ) : (
        <LoadingSpinner />
      )}
    </LanguageContext.Provider>
  );
}

export default EntityForm;
