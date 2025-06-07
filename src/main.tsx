import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { IonApp, IonPage } from "@ionic/react";
import App from "./App";
import LoadingScreen from "./LoadingScreen";
import "./styles/index.css";

const RootComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const minLoadingTime = 0;
    const start = Date.now();

    const handleLoad = () => {
      const elapsedTime = Date.now() - start;
      const remainingTime = minLoadingTime - elapsedTime;

      if (remainingTime > 0) {
        setTimeout(() => setIsLoading(false), remainingTime);
      } else {
        setIsLoading(false);
      }
    };

    window.addEventListener("load", handleLoad);

    if (document.readyState === "complete") {
      handleLoad();
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  return (
    <IonApp>
      {isLoading ? (
        <IonPage>
          <LoadingScreen />
        </IonPage>
      ) : (
        <App />
      )}
    </IonApp>
  );
};

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);
