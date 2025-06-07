import React, { useState } from "react";
import { t } from "i18next";
import { useTheme } from "../../../shared/contexts/ThemeContext";
import RadioSelection from "./RadioSelection";

const ThemeSettings: React.FC = () => {
  const themes = ["light", "dark"];
  const { theme, setTheme } = useTheme();

  const [selectedTheme, setSelectedThemeState] = useState(theme);

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    setSelectedThemeState(newTheme);
  };

  return (
    <RadioSelection
      options={themes}
      selectedValue={selectedTheme}
      onChange={changeTheme}
      optionLabels={themes.reduce(
        (labels, theme) => ({
          ...labels,
          [theme]: t(`themeSettings.themeNames.${theme}`),
        }),
        {}
      )}
    />
  );
};

export default ThemeSettings;
