import { getLanguageCode } from "../../i18n";
import { PageEntity } from "../types/types-app";
import { EntityType } from "../types/types-common";
import { getAppApiUrl } from "./environment";

export const fetchEntity = async <T extends PageEntity>(
  entityType: EntityType,
  entityId: string,
  setEntity: React.Dispatch<React.SetStateAction<T>>,
  setNotFound: React.Dispatch<React.SetStateAction<boolean>>,
  setServerError: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> => {
  const languageCode = getLanguageCode();
  const authToken = localStorage.getItem("authToken");

  try {
    const response = await fetch(
      `${
        getAppApiUrl()
      }/${entityType}s/${entityId}/?languageCode=${languageCode}`,
      {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      }
    );

    if (response.status === 204 || response.status === 404) {
      setNotFound(true);
      setServerError(false);
      return;
    }

    if (!response.ok) {
      throw new Error(`Error fetching ${entityType}: ${response.statusText}`);
    }

    const entity: T = await response.json();

    if (!entity.mainImageAspectRatio) {
      entity.mainImageAspectRatio = 1; // This should be the aspect ratio of the default image
    }
    setEntity(entity);
    setNotFound(false);
    setServerError(false);
  } catch (error) {
    console.error(`Failed to fetch ${entityType}:`, error);
    setNotFound(false);
    setServerError(true);
  }
};
