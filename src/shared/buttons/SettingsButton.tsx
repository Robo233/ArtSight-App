import React from "react";
import NavigationButton from "./NavigationButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

const SettingsButton: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center right-0 absolute">
      <NavigationButton
        url={"/settings"}
        className=" right-2 text-xl p-2 z-10 flex items-center justify-end"
        activeClassName="text-text-hover"
      >
        <FontAwesomeIcon icon={faGear} />
      </NavigationButton>
    </div>
  );
};

export default SettingsButton;
