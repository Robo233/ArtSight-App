import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { t } from "i18next";
import Button from "./Button";

interface ButtonWithLabelAndIconProps {
  icon: any;
  title: string;
  onClick: () => void;
}

const ButtonWithLabelAndIcon: React.FC<ButtonWithLabelAndIconProps> = ({
  icon,
  title,
  onClick,
}) => {
  return (
    <Button
      onClick={onClick}
      className="flex items-center justify-between px-4 py-2 rounded"
      activeClassName="[&>div]:text-text-hover [&>div>span]:text-text-hover text-text-hover"
    >
      <div className="flex items-center transition-smooth">
        <FontAwesomeIcon icon={icon} className="mr-2" />
        <span className="cursor-pointer transition-smooth">{t(title)}</span>
      </div>
      <FontAwesomeIcon icon={faChevronRight} />
    </Button>
  );
};

export default ButtonWithLabelAndIcon;
