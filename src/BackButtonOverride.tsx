import { useEffect } from "react";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

// This is needed to make the device's back button work on Android
const BackButtonOverride = () => {
  if (Capacitor.getPlatform() !== "android") {
    return;
  }

  useEffect(() => {
    const backButtonListener = App.addListener(
      "backButton",
      ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else {
          App.exitApp();
        }
      }
    );

    return () => {
      backButtonListener.remove();
    };
  }, []);

  return null;
};

export default BackButtonOverride;
