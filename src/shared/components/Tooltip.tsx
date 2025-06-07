import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { t } from "i18next";

interface TooltipProps {
  tooltipKey: string;
}

const Tooltip: React.FC<TooltipProps> = ({ tooltipKey }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className=" relative inline-block ml-2"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <span className="cursor-pointer text-text text-lg">
        <FontAwesomeIcon icon={faInfoCircle} />
      </span>
      {visible && (
        <div className="z-10 absolute bottom-full mb-2 right-1/2 px-2 py-1 bg-background text-text border text-sm rounded w-72">
          {t(tooltipKey)}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
