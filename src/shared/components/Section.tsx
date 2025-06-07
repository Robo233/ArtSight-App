import React from "react";
import Tooltip from "./Tooltip";

interface SectionProps {
  title?: string;
  spacing?: string;
  children?: React.ReactNode;
  tooltipKey?: string;
}

const Section: React.FC<SectionProps> = ({
  title,
  spacing = "my-4",
  children,
  tooltipKey,
}) => {
  return (
    <div className={`${spacing} w-full`}>
      <div className="flex items-center justify-between">
        <p className="mb-1 mt-1 text-xl font-bold">{title}</p>
        {tooltipKey && <Tooltip tooltipKey={tooltipKey} />}
      </div>
      <hr className="mb-4 mx-auto w-full border-text" />
      <div className="flex flex-col items-center space-y-4">{children}</div>
    </div>
  );
};

export default Section;
