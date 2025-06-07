import React from "react";
import { HEADER_FOOTER_HEIGHT } from "../../utils/constants";

interface HeaderProps {
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ children }) => {
  const isMobile = window.innerWidth <= 768;

  if (window.innerWidth < 1024 || isMobile) {
    return (
      <div
        className="bg-primary rounded-b-[2rem] rounded-t-none fixed w-full flex items-center justify-center z-10"
        style={{ height: `${HEADER_FOOTER_HEIGHT}px` }}
      >
        {children}
      </div>
    );
  }

  return <></>;
};

export default Header;
