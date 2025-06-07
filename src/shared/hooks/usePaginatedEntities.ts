import { useState, useEffect, useCallback } from "react";

import { getLanguageCode } from "../../i18n";

export function usePaginatedEntities(
  url: string,
  excludeId?: string,
  pageSize: number = 3
) {
  const [items, setItems] = useState<{ id: string; name: string }[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function fetchFirstPage() {
      setItems([]);
      setOffset(0);
      setHasMore(true);
      setLoading(true);

      try {
        const fetchCount = getFetchCount();
        const result = await fetchEntities(0, fetchCount);

        if (!isCancelled) {
          const { items: newItems, hasMore: serverHasMore } = result;
          let wasFiltered = false;
          let filtered = newItems;

          if (excludeId) {
            filtered = newItems.filter(
              (item: { id: string }) => item.id !== excludeId
            );
          }

          if (filtered.length > pageSize) {
            filtered.pop();
            wasFiltered = true;
            
          }
          setItems(filtered);
          setHasMore(serverHasMore || wasFiltered);
          setOffset(wasFiltered ? fetchCount -1 : fetchCount);
        }
      } catch (error) {
        console.error(error);
        if (!isCancelled) {
          setHasMore(false);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    fetchFirstPage();
    return () => {
      isCancelled = true;
    };
  }, [url, pageSize, excludeId]);

  const getFetchCount = () => {
    if (excludeId) {
      return pageSize + 1;
    }
    return pageSize;
  };

  const fetchEntities = async (offsetValue: number, limitValue: number) => {
    const authToken = localStorage.getItem("authToken") || undefined;
    const fullUrl = `${url}&offset=${offsetValue}&limit=${limitValue}&languageCode=${
      getLanguageCode()
    }`;

    const response = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: authToken ? `Bearer ${authToken}` : "",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch entities");
    }

    return response.json();
  };

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const fetchCount = getFetchCount();
      const result = await fetchEntities(offset, fetchCount);

      const { items: newItems, hasMore: serverHasMore } = result;
      let isExcludedItemPresent = false;
      let filtered = newItems;

      if(newItems.some((item: { id: string }) => item.id === excludeId)) {
        isExcludedItemPresent = true;
      }

      if (excludeId) {
        filtered = newItems.filter(
          (item: { id: string }) => item.id !== excludeId
        );
      }

      if (filtered.length > pageSize) {
        filtered.pop();
      }

      setItems((prev) => [...prev, ...filtered]);
      setHasMore(serverHasMore || newItems.length > pageSize);
      if(excludeId){
        setOffset(isExcludedItemPresent ? (prev) => prev + fetchCount : (prev) => prev + fetchCount - 1);
      } else{
        setOffset( (prev) => prev + fetchCount );

      }

    } catch (error) {
      console.error(error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [url, excludeId, loading, hasMore, offset]);

  return { items, hasMore, loading, loadMore };
}
