import React from "react";

export interface LanguageContextValue {
  existingLanguages: string[];
  addLanguage: (lang: string) => void;
  removeLanguage: (lang: string) => void;
}

export const LanguageContext = React.createContext<LanguageContextValue>({
  existingLanguages: [],
  addLanguage: () => {},
  removeLanguage: () => {},
});
