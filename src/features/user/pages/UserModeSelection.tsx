import React from "react";
import { Link, useHistory } from "react-router-dom";
import { t } from "i18next";
import ButtonWithLabel from "../../../shared/buttons/ButtonWithLabel";
import PageTitle from "../../../shared/components/PageTitle";

const UserModeSelection: React.FC = () => {
  const history = useHistory();

  const handleGuest = () => {
    localStorage.setItem("isGuest", "true");
    history.push(`home`);
  };

  return (
    <>
      <PageTitle title={`${t("userModeSelection.userSelection")}`} />
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Link to={`login`}>
          <ButtonWithLabel label={t("shared.logIn")} />
        </Link>
        <ButtonWithLabel
          label={t("userModeSelection.continueAsGuest")}
          onClick={handleGuest}
        />
      </div>
    </>
  );
};

export default UserModeSelection;
