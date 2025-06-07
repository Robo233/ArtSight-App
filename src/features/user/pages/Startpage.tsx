import React from "react";
import { Link, useHistory } from "react-router-dom";
import { t } from "i18next";
import ButtonWithLabel from "../../../shared/buttons/ButtonWithLabel";
import PageTitle from "../../../shared/components/PageTitle";

const Startpage: React.FC = () => {
  return (
    <>
      <PageTitle title={`${t("startPage.title")}`} />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="mb-4 text-center">{t("startPage.welcomeText")}</h1>
        <div className="py-4">
          <Link to={"user-selection"}>
            <ButtonWithLabel label={t("startPage.startPageButtonText")} />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Startpage;
