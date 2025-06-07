import React from "react";
import { useHistory } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

import { HEADER_FOOTER_HEIGHT } from "../../utils/constants";
import BackButton from "../../buttons/BackButton";
import NavigationButton from "../../buttons/NavigationButton";
import SettingsButton from "../../buttons/SettingsButton";

const HeaderWithSettings: React.FC = () => {
  const isMobile = window.innerWidth <= 768;
  const history = useHistory();

  if (window.innerWidth < 1024 || isMobile) {
    return (
      <div
        style={{
          height: `${HEADER_FOOTER_HEIGHT}px`,
          backgroundColor: `var(--color-primary)`,
          top: 0,
        }}
        className="fixed w-full z-10"
      >
        <BackButton onClick={() => history.goBack()} />
        <SettingsButton />
        <div className="h-full flex items-center justify-center right-8 absolute">
          <NavigationButton
            url={`home`}
            className="text-xl p-2 z-10 "
            activeClassName="text-text-hover"
          >
            <FontAwesomeIcon icon={faHouse} />
          </NavigationButton>
        </div>
      </div>
    );
  }

  return <></>;
};

export default HeaderWithSettings;
