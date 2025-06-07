import React, { useState, useEffect } from "react";
import ButtonWithLabel from "../buttons/ButtonWithLabel";
import LoadingSpinner from "./LoadingSpinner";
import Card from "./Card";
import { EntityType } from "../types/types-common";
import Button from "../buttons/Button";
import { t } from "i18next";
import capitalizeFirstLetter from "../utils/capitalizeFirstLetter";
import { getLanguageCode } from "../../i18n";

interface MultiEntitySearchSelectorProps {
  entityType: EntityType;
  selectedEntities: { id: string; name: string }[];
  onSelect: (entity: { id: string; name: string }) => void;
  onRemove: (entityId: string) => void;
}

const MultiEntitySearchSelector: React.FC<MultiEntitySearchSelectorProps> = ({
  entityType,
  selectedEntities,
  onSelect,
  onRemove,
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const performSearch = async () => {
    setLoading(true);
    try {
      const url = new URL(`${import.meta.env.VITE_API_URL_APP}/entityfilter`);
      url.searchParams.append("searchString", searchQuery);
      url.searchParams.append("languageCode", getLanguageCode());
      url.searchParams.append("entityType", entityType);

      const authToken = localStorage.getItem("authToken") || "";
      const response = await fetch(url.toString(), {
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken ? `Bearer ${authToken}` : "",
        },
      });
      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      const result = data.find((res: any) => res.entityType === entityType);
      setSearchResults(result ? result.result?.items || [] : []);
    } catch (error) {
      console.error("Error during search:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    const timeoutId = setTimeout(() => {
      performSearch();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleCardClick = (entity: { id: string; name: string }) => {
    if (!selectedEntities.some((e) => e.id === entity.id)) {
      onSelect(entity);
    }
    setShowSearch(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="w-full">
      {showSearch ? (
        <div className="relative w-full">
          <input
            type="text"
            placeholder={t(
              `multiEntitySearchSelector.select${capitalizeFirstLetter(
                entityType
              )}`
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full border border-text rounded-3xl pl-3 pr-12 py-2 focus:outline-none focus:ring-primary focus:border-primary"
          />
          <Button
            onClick={() => setShowSearch(false)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-text text-xl"
            activeClassName="text-text-hover"
          >
            x
          </Button>
        </div>
      ) : (
        <div className="flex justify-center w-full">
          <ButtonWithLabel
            type="button"
            onClick={() => setShowSearch(true)}
            label={t(
              `multiEntitySearchSelector.select${capitalizeFirstLetter(
                entityType
              )}`
            )}
          />
        </div>
      )}
      {showSearch && (
        <>
          <div className="mt-4 mb-4">
            {loading ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <LoadingSpinner />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-16 gap-4">
                  {searchResults.map((item: any) => (
                    <Card
                      key={item.id}
                      id={item.id}
                      title={item.name}
                      entityType={entityType as any}
                      onClick={() =>
                        handleCardClick({ id: item.id, name: item.name })
                      }
                      highlightQuery={searchQuery}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {t("shared.noResults")}
              </div>
            )}
          </div>
          {selectedEntities.length != 0 && <hr />}
        </>
      )}
      <div className="mt-4 space-y-2 flex flex-col items-center ">
        {selectedEntities.map((entity) => (
          <div
            key={entity.id}
            className="flex items-center justify-center s:space-x-2 "
          >
            <Card id={entity.id} title={entity.name} entityType={entityType} />
            <Button
              type="button"
              onClick={() => onRemove(entity.id)}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-text"
              activeClassName="bg-primary-hover"
            >
              x
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiEntitySearchSelector;
