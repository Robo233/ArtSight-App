import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { t } from "i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import {
  HEADER_FOOTER_HEIGHT,
  HEADER_FOOTER_VERTICAL_OFFSET,
} from "../../../shared/utils/constants";
import HeaderWithSettingsAndTitle from "../../../shared/navigation/headers/HeaderWithSettingsAndTitle";
import ButtonWithLabel from "../../../shared/buttons/ButtonWithLabel";
import PageTitle from "../../../shared/components/PageTitle";
import ButtonWithLabelAndIcon from "../../../shared/buttons/ButtonWithLabelAndIcon";
import {
  faHeart,
  faHistory,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import { isAuthenticatedOrGuest } from "../../../shared/services/auth";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

const UserProfile: React.FC = () => {
  const history = useHistory();

  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    checkForAuth();
    setUserEmail(localStorage.getItem("userEmail"));
  }, []);

  const checkForAuth = async () => {
    const isAuthenticated = await isAuthenticatedOrGuest();
    if (!isAuthenticated) {
      history.push({
        pathname: `/user-selection-with-route`,
        state: { from: "/user-profile" },
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("authToken");
    history.push("user-selection");
  };

  return (
    <>
      <HeaderWithSettingsAndTitle
        title={t("shared.profile")}
        displaySettingsButton
      />
      <PageTitle title={`${t("userProfile.account")}`} />
      <div
        className={`responsive-container flex flex-col items-center justify-center space-y-4 `}
        style={{
          paddingBottom: `${
            HEADER_FOOTER_HEIGHT + HEADER_FOOTER_VERTICAL_OFFSET
          }px`,
        }}
      >
        <div className="mt-[70px]">
          <FontAwesomeIcon
            icon={faUserCircle as IconProp}
            className="text-primary text-8xl text-opacity-50"
          />
        </div>

        {userEmail ? (
          <p className="text-lg">{userEmail}</p>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <p>{t("userProfile.youAreAGuest")}</p>
          </div>
        )}
        <div className="flex items-center justify-center">
          <ButtonWithLabel
            onClick={userEmail ? handleLogout : () => history.push(`login`)}
            label={userEmail ? t("userProfile.logOut") : t("shared.logIn")}
          ></ButtonWithLabel>
        </div>
      </div>
      <div className="responsive-container flex flex-col">
        <ButtonWithLabelAndIcon
          onClick={() => history.push(`favorites`)}
          icon={faHeart}
          title={t("shared.favorites")}
        />
        <hr className="border-t border-text my-2 w-[97.5%] mx-auto" />
        <ButtonWithLabelAndIcon
          onClick={() => history.push("yours")}
          icon={faPencilAlt}
          title={t("shared.yours")}
        />
        <hr className="border-t border-text my-2 w-[97.5%] mx-auto" />
        <ButtonWithLabelAndIcon
          onClick={() => history.push("recentlyViewed")}
          icon={faHistory}
          title={t("shared.recentlyViewed")}
        />
      </div>
    </>
  );
};

export default UserProfile;
