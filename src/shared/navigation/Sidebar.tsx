import React from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faMap,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

import { t } from "i18next";

import NavigationButton from "../buttons/NavigationButton";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const sidebarButtons = [
    { icon: faHome, label: t("shared.home"), paths: ["/home"] },
    {
      icon: faUser,
      label: t("shared.profile"),
      paths: [
        "/user-profile",
        "/user-selection-with-route",
        "/favorites",
        "/yours",
      ],
    },
    { icon: faMap, label: t("shared.maps"), paths: ["/maps"] },
    { icon: faGear, label: t("shared.settings"), paths: ["/settings"] },
  ];

  const strippedPath = location.pathname.replace(/^\/[a-z]{2}(\/|$)/i, "/");
  return (
    <aside
      className="
        fixed
        top-0
        left-0
        z-20
        flex
        flex-col
        bg-background
        h-screen
        py-4
        w-16
        border-text
        border-r-[1px]
        items-center
        xl:items-start
        xl:w-48
      "
    >
      <div className="flex items-center justify-center w-full">
        <img
          src={`/logo.png`}
          className="xl:w-14 w-10 h-auto"
          alt="Logo"
          draggable="false"
        />
      </div>
      {sidebarButtons.map((button, index) => {
        const isActive = button.paths.some((path) => strippedPath === path);

        return (
          <NavigationButton
            url={button.paths[0]}
            key={index}
            className={`xl:ml-2 flex items-center gap-3 mb-4 w-full p-2 rounded-lg`}
            activeClassName="text-text-hover [&>div]:text-text-hover [&>div]:transition-all [&>div]:duration-300 [&>span]:text-text-hover [&>span]:transition-all [&>span]:duration-300"
          >
            {/* The Button doesn't apply the smooth transition on the children, because of this, the [&>span] and the [&>div] are needed in order to make the transitions smooth on the children. */}
            <div
              className={`flex items-center justify-center w-8 ${
                isActive ? "text-text-hover" : ""
              }`}
            >
              <FontAwesomeIcon icon={button.icon} className="text-2xl" />
            </div>
            <span
              className={`cursor-pointer hidden xl:inline ${
                isActive ? "text-text-hover" : ""
              }`}
            >
              {button.label}
            </span>
          </NavigationButton>
        );
      })}
    </aside>
  );
};

export default Sidebar;
