import React from "react";
import Header from "./Header";
import SettingsButton from "../../buttons/SettingsButton";
import BackButton from "../../buttons/BackButton";
import { useHistory } from "react-router-dom";

interface HeaderWithSettingsAndTitleProps {
  title: string;
  displayBackButton?: boolean;
  displaySettingsButton?: boolean;
}

const HeaderWithSettingsAndTitle: React.FC<HeaderWithSettingsAndTitleProps> = ({
  title,
  displayBackButton = false,
  displaySettingsButton = false,
}) => {
  const history = useHistory();

  return (
    <Header>
      {displayBackButton && <BackButton onClick={() => history.goBack()} />}
      <h1 className="text-xl absolute left-8">{title}</h1>
      {displaySettingsButton && <SettingsButton />}
    </Header>
  );
};

export default HeaderWithSettingsAndTitle;
