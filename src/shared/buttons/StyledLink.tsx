import React from "react";
import NavigationButton from "./NavigationButton";

export interface StyledLinkProps {
  label: string;
  url?: string;
}

const StyledLink: React.FC<StyledLinkProps> = ({ label, url }) => {
  return (
    <NavigationButton
      url={url}
      className="text-primary hover:text-primary-hover underline"
    >
      {label}
    </NavigationButton>
  );
};

export default StyledLink;
