import React from "react";
import { SocialMediaPlatform } from "../types/types-common";
import Section from "./Section";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import NavigationButton from "../buttons/NavigationButton";

interface SocialMediaSectionProps {
  socialMedia?: Partial<Record<SocialMediaPlatform, string>>;
}

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  socialMedia,
}) => {
  if (!socialMedia) return null;

  const iconsMap: Record<SocialMediaPlatform, any> = {
    [SocialMediaPlatform.Facebook]: faFacebook,
    [SocialMediaPlatform.Instagram]: faInstagram,
    [SocialMediaPlatform.X]: faTwitter,
    [SocialMediaPlatform.LinkedIn]: faLinkedin,
  };

  return (
    <Section title="Social media">
      <div className="flex space-x-4 items-center">
        {Object.entries(socialMedia).map(([platform, url]) => {
          if (!url) return null;
          const icon = iconsMap[platform as SocialMediaPlatform];
          return (
            <NavigationButton
              key={platform}
              url={url}
              className="text-primary"
              activeClassName="text-primary-hover"
            >
              <FontAwesomeIcon icon={icon} size="2x" />
            </NavigationButton>
          );
        })}
      </div>
    </Section>
  );
};

export default SocialMediaSection;
