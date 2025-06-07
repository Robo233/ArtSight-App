import React, { useEffect, useState } from "react";
import { Route, RouteComponentProps } from "react-router-dom";
import Footer from "./shared/navigation/footers/Footer";
import Sidebar from "./shared/navigation/Sidebar";
import checkMobile from "./shared/utils/isMobile";

export const LayoutRoute: React.FC<{
  path?: string;
  exact?: boolean;
  showFooter?: boolean;
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>;
}> = ({ component: Component, showFooter = true, ...rest }) => {
  const isMobile = checkMobile();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const initialViewportHeight = window.visualViewport
    ? window.visualViewport.height
    : window.innerHeight;
  const [initialHeight] = useState(initialViewportHeight);

  // This is needed in order to hide the footer when the keyboard appears. Otherwise, the footer is displayed above the keyboard
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      ) {
        setIsInputFocused(true);
      }
    };

    const handleFocusOut = (e: FocusEvent) => {
      setIsInputFocused(false);
    };

    window.addEventListener("focusin", handleFocusIn);
    window.addEventListener("focusout", handleFocusOut);

    const handleVisualViewportResize = () => {
      if (window.visualViewport) {
        const currentHeight = window.visualViewport.height;
        if (currentHeight < initialHeight - 100) {
          setIsInputFocused(true);
        } else {
          setIsInputFocused(false);
        }
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener(
        "resize",
        handleVisualViewportResize
      );
    }

    return () => {
      window.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("focusout", handleFocusOut);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          handleVisualViewportResize
        );
      }
    };
  }, [initialHeight]);

  return (
    <Route
      {...rest}
      render={(props) => (
        <>
          <Component {...props} />
          {isMobile && showFooter && !isInputFocused ? (
            <Footer />
          ) : !isMobile && window.innerWidth >= 1024 ? (
            <Sidebar />
          ) : null}
        </>
      )}
    />
  );
};
