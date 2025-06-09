import { getLanguageCode } from "../../i18n";
import { EntityType } from "../types/types-common";
import { PageEntity } from "../types/types-dashboard";
import { getDashboardApiUrl } from "./environment";

export const fetchEntity = async <T extends PageEntity | undefined>(
  entityType: EntityType,
  entityId: string,
  setEntity: React.Dispatch<React.SetStateAction<T>>,
  setNotFound: React.Dispatch<React.SetStateAction<boolean>>,
  setServerError: React.Dispatch<React.SetStateAction<boolean>>
): Promise<void> => {
  try {
    const languageCode = getLanguageCode();
    const authToken = localStorage.getItem("authToken");

    const response = await fetch(
      `${getDashboardApiUrl()}/${entityType}s/${entityId}/?languageCode=${languageCode}`, { headers: authToken ? { Authorization: `Bearer ${authToken}` } : {}},
    );

    if (response.status === 204 || response.status === 404) {
      setNotFound(true);
      setServerError(false);
      return;
    }

    if (!response.ok) {
      throw new Error(`Error fetching ${entityType}: ${response.statusText}`);
    }

    const entity: T = (await response.json()) as T;
    setEntity(entity);
    setNotFound(false);
    setServerError(false);

  } catch (error) {
    console.error(`Failed to fetch ${entityType}:`, error);
    setNotFound(false);
    setServerError(true);

  }
};

export const deleteImage = (
  entityType: string,
  id: string,
  fileName: string
) => {
  const authToken = localStorage.getItem("authToken");

  fetch(
    `${
      getDashboardApiUrl()
    }/images/delete/${entityType}/${id}/${fileName}`,
    {
      method: "DELETE",
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},

    }
  )
    .then((response) => response.json())
    .catch((error) => console.error("Error deleting artwork:", error));
};

export const deleteEntity = async (entityType: string, entityId: string) => {
  const authToken = localStorage.getItem("authToken");
  return fetch(
    `${getDashboardApiUrl()}/${entityType}s/delete/${entityId}`,
    {
      method: "DELETE",
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},

    }
  );
};
