import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  CustomScheduleEntry,
  Exhibition,
  ExhibitionSchedule,
  ExhibitionScheduleType,
  FixedScheduleEntry,
  ImageDescription,
} from "../../../shared/types/types-dashboard";
import EntityForm from "../../../shared/components/EntityForm";
import Section from "../../../shared/components/Section";
import Input from "../../../shared/components/Input";
import ImageDescriptionsSection from "../../../shared/components/ImageDescriptionsSection";
import ButtonWithLabel from "../../../shared/buttons/ButtonWithLabel";
import MultiEntitySearchSelector from "../../../shared/components/MultiEntitySearchSelector";
import ContactInformationSection from "../../../shared/components/ContactInformationSection";
import LocationPickerSection from "../../../shared/components/LocationPickerSection";
import { fetchEntity } from "../../../shared/services/entityServiceDashboard";
import { t } from "i18next";
import Tooltip from "../../../shared/components/Tooltip";

const ExhibitionForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [exhibition, setExhibition] = useState<Exhibition>({
    id: "",
    name: {},
    description: {},
    latitude: undefined,
    longitude: undefined,
    address: "",
    genreIds: [],
    schedule: {
      scheduleType: "None",
      fixedEntries: [],
      customEntries: [],
    } as ExhibitionSchedule,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageDescriptions, setImageDescriptions] = useState<
    ImageDescription[]
  >([]);
  const [notFound, setNotFound] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [serverError, setServerError] = useState(false);

  const [selectedGenres, setSelectedGenres] = useState<
    { id: string; name: string }[]
  >([]);

  const handleGenreSelect = (genre: { id: string; name: string }) => {
    if (!selectedGenres.some((g) => g.id === genre.id)) {
      setSelectedGenres((prev) => [...prev, genre]);
    }
  };

  const handleGenreRemove = (genreId: string) => {
    setSelectedGenres((prev) => prev.filter((g) => g.id !== genreId));
  };

  useEffect(() => {
    if (id) {
      fetchEntity("exhibition", id, setExhibition, setNotFound, setServerError);
    }
  }, [id]);

  useEffect(() => {
    setExhibition((prev) => ({
      ...prev,
      genreIds: selectedGenres.map((g) => g.id),
      genreNames: selectedGenres.map((g) => g.name),
    }));
  }, [selectedGenres]);

  useEffect(() => {
    if (
      exhibition.genreIds &&
      exhibition.genreNames &&
      exhibition.genreIds.length > 0
    ) {
      const newGenres = exhibition.genreIds.map((id, index) => ({
        id,
        name: exhibition.genreNames![index] || "Unknown",
      }));
      if (JSON.stringify(newGenres) !== JSON.stringify(selectedGenres)) {
        setSelectedGenres(newGenres);
      }
    }
  }, [exhibition]);

  const handleScheduleTypeChange = (value: ExhibitionScheduleType | "None") => {
    setExhibition({
      ...exhibition,
      schedule:
        value === "None"
          ? { scheduleType: "None", fixedEntries: [], customEntries: [] }
          : {
              scheduleType: value,
              fixedEntries:
                value === "Fixed" ? exhibition.schedule!.fixedEntries : [],
              customEntries:
                value === "Custom" ? exhibition.schedule!.customEntries : [],
            },
    });
  };

  const updateFixedEntry = (
    index: number,
    field: keyof FixedScheduleEntry,
    value: string | boolean
  ) => {
    const updatedEntries = exhibition.schedule!.fixedEntries.map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    );
    setExhibition({
      ...exhibition,
      schedule: exhibition.schedule
        ? {
            scheduleType: exhibition.schedule.scheduleType,
            fixedEntries: updatedEntries,
            customEntries: exhibition.schedule.customEntries,
          }
        : {
            scheduleType: "None",
            fixedEntries: updatedEntries,
            customEntries: [],
          },
    });
  };

  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const handleFixedDayToggle = (day: string, isChecked: boolean) => {
    const currentEntries = exhibition.schedule?.fixedEntries || [];
    if (isChecked) {
      if (!currentEntries.some((entry) => entry.day === day)) {
        const newEntry: FixedScheduleEntry = {
          day,
          startTime: "09:00",
          endTime: "17:00",
          isNonStop: false,
        };
        setExhibition({
          ...exhibition,
          schedule: exhibition.schedule
            ? {
                scheduleType: exhibition.schedule.scheduleType,
                fixedEntries: [...exhibition.schedule.fixedEntries, newEntry],
                customEntries: exhibition.schedule.customEntries,
              }
            : {
                scheduleType: "None",
                fixedEntries: [newEntry],
                customEntries: [],
              },
        });
      }
    } else {
      const newEntries = currentEntries.filter((entry) => entry.day !== day);
      setExhibition({
        ...exhibition,
        schedule: exhibition.schedule
          ? {
              scheduleType: exhibition.schedule.scheduleType,
              fixedEntries: newEntries,
              customEntries: exhibition.schedule.customEntries,
            }
          : {
              scheduleType: "None",
              fixedEntries: newEntries,
              customEntries: [],
            },
      });
    }
  };

  const addCustomEntry = () => {
    const newEntry: CustomScheduleEntry = {
      date: "",
      startTime: "09:00",
      endTime: "17:00",
      isNonStop: false,
    };
    setExhibition({
      ...exhibition,
      schedule: exhibition.schedule
        ? {
            scheduleType: exhibition.schedule.scheduleType,
            fixedEntries: exhibition.schedule.fixedEntries,
            customEntries: [...exhibition.schedule.customEntries, newEntry],
          }
        : {
            scheduleType: "None",
            fixedEntries: [],
            customEntries: [newEntry],
          },
    });
  };

  const updateCustomEntry = (
    index: number,
    field: keyof CustomScheduleEntry,
    value: string | boolean
  ) => {
    const updatedEntries = exhibition.schedule!.customEntries.map((entry, i) =>
      i === index ? { ...entry, [field]: value } : entry
    );
    setExhibition({
      ...exhibition,
      schedule: exhibition.schedule
        ? {
            scheduleType: exhibition.schedule.scheduleType,
            fixedEntries: exhibition.schedule.fixedEntries,
            customEntries: updatedEntries,
          }
        : {
            scheduleType: "None",
            fixedEntries: [],
            customEntries: updatedEntries,
          },
    });
  };

  const removeCustomEntry = (index: number) => {
    const updatedEntries = exhibition.schedule!.customEntries.filter(
      (_, i) => i !== index
    );
    setExhibition({
      ...exhibition,
      schedule: exhibition.schedule
        ? {
            scheduleType: exhibition.schedule.scheduleType,
            fixedEntries: exhibition.schedule.fixedEntries,
            customEntries: updatedEntries,
          }
        : {
            scheduleType: "None",
            fixedEntries: [],
            customEntries: updatedEntries,
          },
    });
  };

  const addCustomFormData = (formData: FormData) => {
    imageFiles.forEach((file, index) => {
      formData.append(`ImageDescriptions[${index}].Image`, file);
    });
    imageDescriptions.forEach((descObj, index) => {
      Object.entries(descObj).forEach(([lang, desc]) => {
        formData.append(
          `ImageDescriptions[${index}].Descriptions[${lang}]`,
          desc || ""
        );
      });
    });
  };

  const handleSuccess = () => {
    setSubmissionSuccess(true);
    setTimeout(() => setSubmissionSuccess(false), 100);
  };
  return (
    <>
      <EntityForm
        entityType="exhibition"
        entity={exhibition}
        setEntity={setExhibition}
        entityId={id}
        transformFormData={addCustomFormData}
        onSuccess={handleSuccess}
        translatableFields={["address"]}
        notFound={notFound}
        serverError={serverError}
      >
        <ContactInformationSection
          contactInformation={exhibition.contactInfo || {}}
          onChange={(updatedContactInfo) =>
            setExhibition({ ...exhibition, contactInfo: updatedContactInfo })
          }
          entityType="exhibition"
        />
        <LocationPickerSection
          initialPosition={
            exhibition.latitude && exhibition.longitude
              ? {
                  lat: exhibition.latitude,
                  lng: exhibition.longitude,
                }
              : null
          }
          onLocationSelect={(pos) => {
            exhibition.latitude = pos?.lat;
            exhibition.longitude = pos?.lng;
          }}
          markerAddress={exhibition.address}
          entityType="exhibition"
        />
        <Section title="Genres" tooltipKey="exhibitionForm.tooltip.genres">
          <MultiEntitySearchSelector
            entityType="genre"
            selectedEntities={selectedGenres}
            onSelect={handleGenreSelect}
            onRemove={handleGenreRemove}
          />
        </Section>
        <ImageDescriptionsSection
          imageDescriptions={imageDescriptions}
          onChangeImageDescriptions={setImageDescriptions}
          imageFiles={imageFiles}
          onChangeImageFiles={setImageFiles}
          entityType="exhibition"
          id={id}
          submissionSuccess={submissionSuccess}
        />
        <Section title="Schedule" tooltipKey="exhibitionForm.tooltip.schedule">
          <div className="flex flex-col gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="None"
                checked={exhibition.schedule?.scheduleType === "None"}
                onChange={() => handleScheduleTypeChange("None")}
                className="appearance-none w-5 h-5 border border-text rounded-full checked:bg-primary checked:border-primary cursor-pointer"
              />
              {t("exhibitionForm.noSchedule")}
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Fixed"
                checked={exhibition.schedule?.scheduleType === "Fixed"}
                onChange={() => handleScheduleTypeChange("Fixed")}
                className="appearance-none w-5 h-5 border border-text rounded-full checked:bg-primary checked:border-primary cursor-pointer"
              />
              {t("exhibitionForm.fixedSchedule")}
              <Tooltip tooltipKey="exhibitionForm.tooltip.fixedSchedule" />
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="Custom"
                checked={exhibition.schedule?.scheduleType === "Custom"}
                onChange={() => handleScheduleTypeChange("Custom")}
                className="appearance-none w-5 h-5 border border-text rounded-full checked:bg-primary checked:border-primary cursor-pointer"
              />
              {t("exhibitionForm.customSchedule")}
              <Tooltip tooltipKey="exhibitionForm.tooltip.customSchedule" />
            </label>
          </div>
          {exhibition.schedule?.scheduleType === "Fixed" && (
            <div className="flex flex-wrap gap-4">
              {daysOfWeek.map((day) => {
                const fixedEntry = exhibition.schedule?.fixedEntries.find(
                  (entry) => entry.day === day
                );
                const isSelected = !!fixedEntry;
                return (
                  <div
                    key={day}
                    className="flex flex-col mb-2 border p-2 border-text rounded-lg w-full md:flex-1"
                  >
                    <label className="flex items-center gap-x-2 ">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) =>
                          handleFixedDayToggle(day, e.target.checked)
                        }
                        className="w-5 h-5 appearance-none border-2 border-text rounded-sm cursor-pointer checked:bg-primary checked:border-primary"
                      />
                      {t(`shared.${day}`)}
                    </label>
                    <div className="flex flex-col ml-4">
                      <label
                        className={`flex items-center gap-x-2 py-2 ${
                          !isSelected
                            ? " text-text-hover cursor-not-allowed"
                            : " text-text"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected ? fixedEntry!.isNonStop : false}
                          onChange={(e) => {
                            if (!isSelected) {
                              handleFixedDayToggle(day, true);
                            }
                            const index =
                              exhibition.schedule!.fixedEntries.findIndex(
                                (entry) => entry.day === day
                              );
                            if (index >= 0) {
                              updateFixedEntry(
                                index,
                                "isNonStop",
                                e.target.checked
                              );
                            }
                          }}
                          disabled={!isSelected}
                          className={`w-5 h-5 appearance-none border-2 border-text rounded-sm cursor-pointer checked:bg-primary checked:border-primary ${
                            !isSelected ? "border-text-hover" : " border-text"
                          }`}
                        />
                        {t("shared.nonStop")}
                      </label>
                      <div className="flex flex-col gap-2">
                        <Input
                          label={t("shared.startTime")}
                          type="time"
                          value={isSelected ? fixedEntry!.startTime : "09:00"}
                          onChange={(e) => {
                            if (!isSelected) {
                              handleFixedDayToggle(day, true);
                            }
                            const index =
                              exhibition.schedule!.fixedEntries.findIndex(
                                (entry) => entry.day === day
                              );
                            if (index >= 0) {
                              updateFixedEntry(
                                index,
                                "startTime",
                                e.target.value
                              );
                            }
                          }}
                          disabled={
                            !isSelected || (isSelected && fixedEntry!.isNonStop)
                          }
                        />
                        <Input
                          label={t("shared.endTime")}
                          type="time"
                          value={isSelected ? fixedEntry!.endTime : "17:00"}
                          onChange={(e) => {
                            if (!isSelected) {
                              handleFixedDayToggle(day, true);
                            }
                            const index =
                              exhibition.schedule!.fixedEntries.findIndex(
                                (entry) => entry.day === day
                              );
                            if (index >= 0) {
                              updateFixedEntry(
                                index,
                                "endTime",
                                e.target.value
                              );
                            }
                          }}
                          disabled={
                            !isSelected || (isSelected && fixedEntry!.isNonStop)
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {exhibition.schedule?.scheduleType === "Custom" && (
            <div>
              <div className="flex justify-center mb-4">
                <ButtonWithLabel
                  type="button"
                  label="Add Custom Entry"
                  onClick={addCustomEntry}
                />
              </div>
              <div className="flex flex-wrap gap-4">
                {exhibition.schedule.customEntries.map((entry, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-2 items-center mb-2 border border-text rounded-lg p-3 mt-2 w-full md:flex-1"
                  >
                    <Input
                      label={t("exhibitionForm.date")}
                      type="date"
                      value={entry.date}
                      onChange={(e) =>
                        updateCustomEntry(index, "date", e.target.value)
                      }
                    />
                    <label className="flex items-center gap-x-2 py-2">
                      <input
                        type="checkbox"
                        checked={entry.isNonStop || false}
                        onChange={(e) =>
                          updateCustomEntry(
                            index,
                            "isNonStop",
                            e.target.checked
                          )
                        }
                        className="w-5 h-5 appearance-none border-2 border-text rounded-sm cursor-pointer checked:bg-primary checked:border-primary"
                      />
                      {t("shared.nonStop")}
                    </label>
                    {!entry.isNonStop && (
                      <div className="flex flex-col gap-2">
                        <Input
                          label={t("shared.startTime")}
                          type="time"
                          value={entry.startTime}
                          onChange={(e) =>
                            updateCustomEntry(
                              index,
                              "startTime",
                              e.target.value
                            )
                          }
                        />
                        <Input
                          label={t("shared.endTime")}
                          type="time"
                          value={entry.endTime}
                          onChange={(e) =>
                            updateCustomEntry(index, "endTime", e.target.value)
                          }
                        />
                      </div>
                    )}
                    <ButtonWithLabel
                      type="button"
                      label={t("shared.remove")}
                      onClick={() => removeCustomEntry(index)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Section>
      </EntityForm>
    </>
  );
};

export default ExhibitionForm;
