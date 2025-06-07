import React from "react";
import ErrorPage from "../../../shared/components/ErrorPage";
import { useTheme } from "../../../shared/contexts/ThemeContext";
import { t } from "i18next";

const NotFoundPage: React.FC = () => {
  const theme = useTheme().theme;
  return (
    <>
      <ErrorPage data-theme={theme} title={t("notFoundPage.notFound")} />
    </>
  );
};

export default NotFoundPage;
