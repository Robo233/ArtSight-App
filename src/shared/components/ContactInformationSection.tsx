import React, { useRef, useState } from "react";
import { ContactInfo, SocialMediaPlatform } from "../types/types-common";
import Section from "./Section";
import Input from "./Input";
import CustomDropdown from "./CustomDropdown";
import Button from "../buttons/Button";
import ButtonWithLabel from "../buttons/ButtonWithLabel";
import { t } from "i18next";

interface ContactInformationSectionProps {
  contactInformation: ContactInfo;
  onChange: (contactInformation: ContactInfo) => void;
  entityType: string;
}

const ContactInformationSection: React.FC<ContactInformationSectionProps> = ({
  contactInformation,
  onChange,
  entityType,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<
    SocialMediaPlatform | ""
  >("");
  const [platformLink, setPlatformLink] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  const currentSocialMedia = contactInformation.socialMedia || {};

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange({ ...contactInformation, phoneNumber: e.target.value });
  };

  const handleEmailChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange({ ...contactInformation, email: e.target.value });
  };

  const handleWebsiteChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange({ ...contactInformation, website: e.target.value });
  };

  const addSocialMediaEntry = () => {
    if (selectedPlatform && platformLink) {
      const updatedSocialMedia = {
        ...currentSocialMedia,
        [selectedPlatform]: platformLink,
      };
      onChange({ ...contactInformation, socialMedia: updatedSocialMedia });
      setSelectedPlatform("");
      setPlatformLink("");
    }
  };

  const updateSocialMediaEntry = (
    platform: SocialMediaPlatform,
    link: string
  ) => {
    const updatedSocialMedia = { ...currentSocialMedia, [platform]: link };
    onChange({ ...contactInformation, socialMedia: updatedSocialMedia });
  };

  const removeSocialMediaEntry = (platform: SocialMediaPlatform) => {
    const updatedSocialMedia = { ...currentSocialMedia };
    delete updatedSocialMedia[platform];
    onChange({ ...contactInformation, socialMedia: updatedSocialMedia });
  };

  return (
    <>
      <Section
        title={t("contactInformationSection.contactInformation")}
        tooltipKey={`${entityType}Form.tooltip.contactInformation`}
      >
        <div className="flex flex-col items-center space-y-4">
          <Input
            label={t("shared.phoneNumber")}
            type="tel"
            value={contactInformation.phoneNumber || ""}
            onChange={handlePhoneChange}
          />
          <Input
            label={t("shared.email")}
            type="email"
            value={contactInformation.email || ""}
            onChange={handleEmailChange}
          />
          <Input
            label={t("shared.webpage")}
            type="url"
            value={contactInformation.website || ""}
            onChange={handleWebsiteChange}
          />
        </div>
      </Section>
      <Section
        title={t("shared.socialMedia")}
        tooltipKey={`${entityType}Form.tooltip.socialMedia`}
      >
        <div className="w-full flex flex-col items-center ">
          {Object.entries(currentSocialMedia).map(([platform, link]) => (
            <div
              key={platform}
              className="flex items-center space-x-2 mb-4 justify-center"
            >
              <Input
                label={platform}
                type="url"
                value={link || ""}
                onChange={(e) =>
                  updateSocialMediaEntry(
                    platform as SocialMediaPlatform,
                    e.target.value
                  )
                }
                width={"260px"}
              />
              <Button
                type="button"
                onClick={() =>
                  removeSocialMediaEntry(platform as SocialMediaPlatform)
                }
                className="relative top-3 w-8 h-8 rounded-full flex items-center justify-center bg-primary text-text"
                activeClassName="bg-primary-hover"
              >
                x
              </Button>
            </div>
          ))}

          <div
            ref={dropdownContainerRef}
            className="relative flex flex-col items-center "
          >
            <ButtonWithLabel
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              label={
                selectedPlatform ||
                t("contactInformationSection.selectPlatform")
              }
              clasName="mb-4"
            />
            <CustomDropdown
              options={Object.values(SocialMediaPlatform).map((platform) => ({
                name: platform,
                value: platform,
                selected: platform === selectedPlatform,
              }))}
              isOpen={isDropdownOpen}
              onClose={() => setIsDropdownOpen(false)}
              onOptionClick={(option) => {
                setSelectedPlatform(option.value as SocialMediaPlatform);
              }}
              containerClassName="w-40"
              dropdownDirection="down"
              containerRef={dropdownContainerRef}
            />
            <Input
              label="Link"
              type="url"
              value={platformLink}
              onChange={(e) => setPlatformLink(e.target.value)}
              className="mb-4"
            />
            {platformLink && selectedPlatform && (
              <ButtonWithLabel
                type="button"
                onClick={addSocialMediaEntry}
                label={t("contactInformationSection.add")}
              />
            )}
          </div>
        </div>
      </Section>
    </>
  );
};

export default ContactInformationSection;
