import { useEffect, useState } from "react";
import { PageEntity } from "../types/types-app";
import i18n, { getLanguageCode } from "../../i18n";
import { fetchEntity } from "../services/entityServiceApp";
import { EntityType } from "../types/types-common";

export function useEntityDataApp<T extends PageEntity>(
    entityType: EntityType,
    id: string | undefined,
    initialEntity: T
  ) {
    const [entity, setEntity] = useState<T>(initialEntity);
    const [languageCode, setLanguageCode] = useState("");
    const [notFound, setNotFound] = useState(false);
    const [serverError, setServerError] = useState(false);
  
    useEffect(() => {
      if (id) {
        setLanguageCode(getLanguageCode());
  
        fetchEntity<T>(
          entityType,
          id,
          setEntity,
          setNotFound,
          setServerError
        ).catch((error) => {
          console.error("Fetch error:", error);
        });
      }
    }, [id, i18n.language]);
  
    return { entity, languageCode, notFound, serverError };
}
  