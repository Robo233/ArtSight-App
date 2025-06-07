import React from "react";
import { useTheme } from "../../../shared/contexts/ThemeContext";

// The logo is taken from https://developers.google.com/identity/branding-guidelines

type GoogleSignInButtonProps = {
  onClick: () => void;
};

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onClick }) => {
  const theme = useTheme();

  return (
    <button onClick={onClick}>
      <img
        src={
          theme.theme === "light"
            ? "web_light_sq_na@4x.png"
            : "web_dark_sq_na@4x.png"
        }
        alt="Google logo"
        className="w-8 h-8"
        draggable="false"
      />
    </button>
  );
};

export default GoogleSignInButton;
