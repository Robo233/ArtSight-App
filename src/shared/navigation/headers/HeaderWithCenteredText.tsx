import React from "react";

import SettingsButton from "../../buttons/SettingsButton";
import Header from "./Header";

interface HeaderWithCenteredTextProps {
  text: string;
}

const HeaderWithCenteredText: React.FC<HeaderWithCenteredTextProps> = ({
  text,
}) => {
  return (
    <Header>
      <SettingsButton />
      <div className="top-5 text-center mx-10">
        <p>{text}</p>
      </div>
    </Header>
  );
};

export default HeaderWithCenteredText;
