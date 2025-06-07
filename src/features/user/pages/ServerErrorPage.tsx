import React from "react";
import { t } from "i18next";
import ErrorPage from "../../../shared/components/ErrorPage";

const ServerErrorPage: React.FC = () => {
  return (
    <>
      <ErrorPage title={t(`serverErrorPage.serverError`)} />
    </>
  );
};

export default ServerErrorPage;
