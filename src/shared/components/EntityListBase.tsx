import { t } from "i18next";
import { useState, useEffect } from "react";
import { EntityType } from "../types/types-common";
import { getLanguageCode } from "../../i18n";
import HeaderWithSettingsAndTitle from "../navigation/headers/HeaderWithSettingsAndTitle";
import PageTitle from "./PageTitle";
import {
  HEADER_FOOTER_HEIGHT,
  HEADER_FOOTER_VERTICAL_OFFSET,
} from "../utils/constants";
import Section from "./Section";
import Card from "./Card";
import ButtonWithLabel from "../buttons/ButtonWithLabel";
import LoadingSpinner from "./LoadingSpinner";
import ServerErrorPage from "../../features/user/pages/ServerErrorPage";
import { getAppApiUrl } from "../services/environment";

interface EntityListConfig {
  additionalParams?: Record<string, string>;
}

interface SearchResults {
  [key: string]: {
    items: any[];
    hasMore: boolean;
    offset: number;
  };
}

interface EntityListBaseProps {
  title: string;
  config?: EntityListConfig;
  noEntitiesKey: string;
  displayBackButton?: boolean;
}

const EntityListBase = ({
  title,
  config,
  noEntitiesKey,
  displayBackButton = true,
}: EntityListBaseProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [serverError, setServerError] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [searchResults, setSearchResults] = useState<SearchResults | null>(
    null
  );

  const buildInitialUrl = (query: string): string => {
    const url = new URL(`${getAppApiUrl()}/entityfilter`);
    url.searchParams.append("searchString", query);
    url.searchParams.append("languageCode", getLanguageCode());
    if (config?.additionalParams) {
      Object.entries(config.additionalParams).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    return url.toString();
  };

  const buildLoadMoreUrl = (
    query: string,
    offset: number,
    entityType: string
  ): string => {
    const url = new URL(`${getAppApiUrl()}/entityfilter/by-entity`);
    url.searchParams.append("searchString", query);
    url.searchParams.append("offset", offset.toString());
    url.searchParams.append("languageCode", getLanguageCode());
    url.searchParams.append("entityType", entityType);
    if (config?.additionalParams) {
      Object.entries(config.additionalParams).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    return url.toString();
  };

  const getAuthHeaders = () => {
    const authToken = localStorage.getItem("authToken") || "";
    return {
      "Content-Type": "application/json",
      Authorization: authToken ? `Bearer ${authToken}` : "",
    };
  };

  useEffect(() => {
    let isCurrent = true;
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length > 100) {
        setSearchError(t("entityListBase.searchTooLong"));
        setSearchResults(null);
        return;
      } else {
        setSearchError("");
        performSearch().then(() => {
          if (!isCurrent) return;
        });
      }
    }, 300);

    return () => {
      isCurrent = false;
      clearTimeout(delayDebounceFn);
    };
  }, [searchQuery]);

  const performSearch = async () => {
    try {
      const url = new URL(buildInitialUrl(searchQuery));
      const response = await fetch(url.toString(), {
        headers: getAuthHeaders(),
      });
      if (response.status === 204 || response.status === 404) {
        setServerError(true);
        return;
      }
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();

      const formattedResults = data.reduce(
        (acc: SearchResults, result: any) => {
          acc[result.entityType] = {
            items: result.result?.items || [],
            hasMore: result.result?.hasMore || false,
            offset: 0,
          };
          return acc;
        },
        {} as SearchResults
      );
      setSearchResults(formattedResults);
      setAppliedQuery(searchQuery);
    } catch (error) {
      console.error("Error during search:", error);
      setServerError(true);
    }
  };

  const handleLoadMore = async (entityType: EntityType) => {
    if (!searchResults) return;
    try {
      const newOffset = searchResults[entityType].offset + 3;
      const url = new URL(buildLoadMoreUrl(searchQuery, newOffset, entityType));
      const response = await fetch(url.toString(), {
        headers: getAuthHeaders(),
      });
      if (response.status === 204 || response.status === 404) {
        setServerError(false);
        return;
      }
      if (!response.ok) throw new Error("Load more failed");
      const data = await response.json();

      setSearchResults((prev) => ({
        ...prev!,
        [entityType]: {
          items: [...prev![entityType].items, ...data.items],
          hasMore: data.hasMore,
          offset: newOffset,
        },
      }));
    } catch (error) {
      console.error("Error loading more:", error);
      setServerError(true);
    }
  };

  if (serverError) {
    return <ServerErrorPage />;
  }

  return (
    <>
      <HeaderWithSettingsAndTitle
        title={t(title)}
        displayBackButton={displayBackButton}
        displaySettingsButton
      />
      <PageTitle title={t(title)} />
      <div
        className="responsive-container"
        style={{
          paddingTop: `${
            HEADER_FOOTER_HEIGHT + HEADER_FOOTER_VERTICAL_OFFSET - 10
          }px`,
          paddingBottom: `${
            HEADER_FOOTER_HEIGHT + HEADER_FOOTER_VERTICAL_OFFSET
          }px`,
        }}
      >
        <div className="mx-4 mt-2 mb-4">
          <input
            type="text"
            placeholder={t("entityListBase.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full border-[1px] border-text rounded-3xl pl-3 pr-12 py-2 bg-background placeholder-text-hover focus:outline-none focus:ring-primary focus:border-primary"
          />
          {searchError && (
            <div className="text-center py-8 text-red-500">{searchError}</div>
          )}
        </div>
        {!searchError &&
          (searchResults ? (
            Object.values(searchResults).some((r) => r.items.length > 0) ? (
              Object.entries(searchResults).map(
                ([entityType, result]) =>
                  result.items.length > 0 && (
                    <Section
                      key={entityType}
                      title={t(`shared.${entityType}s`)}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-16 gap-4">
                        {result.items.map((item: any) => (
                          <Card
                            key={item.id}
                            id={item.id}
                            title={item.name}
                            entityType={entityType as EntityType}
                            highlightQuery={appliedQuery}
                          />
                        ))}
                      </div>
                      {result.hasMore && (
                        <div className="mt-4 flex justify-center">
                          <ButtonWithLabel
                            onClick={() =>
                              handleLoadMore(entityType as EntityType)
                            }
                            label={t("shared.loadMore")}
                          />
                        </div>
                      )}
                    </Section>
                  )
              )
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchQuery.trim() !== ""
                  ? t("shared.noResults")
                  : t(`${noEntitiesKey}`)}
              </div>
            )
          ) : (
            <div className="flex items-center justify-center min-h-[200px]">
              <LoadingSpinner />
            </div>
          ))}
      </div>
    </>
  );
};

export default EntityListBase;
