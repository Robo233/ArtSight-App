import React from "react";
import { t } from "i18next";
import ErrorPage from "./ErrorPage";
import capitalizeFirstLetter from "../utils/capitalizeFirstLetter";

interface EntityNotFoundProps {
  entityType: string;
}

const EntityNotFound: React.FC<EntityNotFoundProps> = ({ entityType }) => {
  return (
    <>
      <ErrorPage
        title={t(`entityNotFound.notFound${capitalizeFirstLetter(entityType)}`)}
      />
    </>
  );
};

export default EntityNotFound;
