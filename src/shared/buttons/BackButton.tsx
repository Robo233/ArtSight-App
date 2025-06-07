import React from "react";

import Button from "./Button";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="absolute top-4 left-4 z-20"
      activeClassName="text-text-hover"
      aria-label="Go back"
    >
      <FontAwesomeIcon icon={faChevronLeft} />
    </Button>
  );
};

export default BackButton;
