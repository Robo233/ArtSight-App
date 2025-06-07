import React from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faMap,
  faCamera,
  faGear,
} from "@fortawesome/free-solid-svg-icons";
import { HEADER_FOOTER_HEIGHT } from "../../utils/constants";
import NavigationButton from "../../buttons/NavigationButton";

const Footer: React.FC = () => {
  const location = useLocation();
  const isMobile = window.innerWidth <= 768;

  const strippedPath = location.pathname.replace(/^\/[a-z]{2}(\/|$)/i, "/");

  const footerButtons = [
    { icon: faHome, paths: ["/home"] },
    {
      icon: faUser,
      paths: [
        "/user-profile",
        "/user-selection-with-route",
        "/favorites",
        "/yours",
      ],
    },
    { icon: faMap, paths: ["/maps"] },
    isMobile
      ? { icon: faCamera, paths: ["/camera"] }
      : { icon: faGear, paths: ["/settings"] },
  ];

  return (
    <div
      style={{ height: `${HEADER_FOOTER_HEIGHT}px` }}
      className="bg-background rounded-t-[2rem] fixed bottom-0 left-0 right-0 flex justify-around items-center w-full z-20"
    >
      {footerButtons.map((button, index) => {
        const isActive = button.paths.some((path) => strippedPath === path);
        return (
          <NavigationButton
            url={button.paths[0]}
            key={index}
            className={`flex flex-col items-center ${
              isActive ? "text-text-hover" : ""
            }`}
            activeClassName="text-text-hover"
          >
            <FontAwesomeIcon icon={button.icon} className="text-2xl" />
          </NavigationButton>
        );
      })}
    </div>
  );
};

export default Footer;
