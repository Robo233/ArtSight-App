import { useState, useEffect } from "react";
import EntityListBase from "./EntityListBase";
import { isAuthenticated } from "../services/auth";
import { useHistory } from "react-router-dom";
import { t } from "i18next";
import ButtonWithLabel from "../buttons/ButtonWithLabel";

interface ProtectedEntityListProps {
  title: string;
  config?: {
    additionalParams?: Record<string, string>;
  };
  loginMessageKey: string;
  noEntitiesKey: string;
}

const ProtectedEntityList = ({
  title,
  config,
  loginMessageKey,
  noEntitiesKey,
}: ProtectedEntityListProps) => {
  const history = useHistory();

  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = isAuthenticated();
    setAuthenticated(auth);
  }, []);

  if (!authenticated) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-center mb-4">{t(loginMessageKey)}</h1>
          <ButtonWithLabel
            onClick={() =>
              history.push(
                `login?redirectTo=${encodeURIComponent(
                  window.location.pathname
                )}`
              )
            }
            label={t("shared.logIn")}
          />
        </div>
      </>
    );
  }

  return (
    <EntityListBase
      title={title}
      config={config}
      noEntitiesKey={noEntitiesKey}
    />
  );
};

export default ProtectedEntityList;
