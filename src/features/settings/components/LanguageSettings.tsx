import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { changeLanguage, t } from "i18next";
import RadioSelection from "./RadioSelection";
import { getLanguageCode } from "../../../i18n";

const LanguageSettings: React.FC = () => {
  const { i18n } = useTranslation();
  const languages = Object.keys(i18n.services.resourceStore.data);
  const [selectedLanguage, setSelectedLanguage] = useState(getLanguageCode());

  useEffect(() => {
    setSelectedLanguage(getLanguageCode());
  }, [i18n.language]);

  return (
    <RadioSelection
      options={languages}
      selectedValue={selectedLanguage}
      onChange={changeLanguage}
      optionLabels={languages.reduce(
        (labels, lng) => ({
          ...labels,
          [lng]: t(`languageSettings.languageNames.${lng}`),
        }),
        {}
      )}
    />
  );
};

export default LanguageSettings;
