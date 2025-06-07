import React, { useEffect } from "react";
import { t } from "i18next";
import { usePaginatedEntities } from "../hooks/usePaginatedEntities";
import Section from "./Section";
import Card from "./Card";
import { EntityType } from "../types/types-common";
import ButtonWithLabel from "../buttons/ButtonWithLabel";

interface CardListSectionProps {
  url: string;
  entityType: EntityType;
  title: string;
  excludeId?: string;
  onHasItems?: (hasItems: boolean) => void;
}

const CardListSection: React.FC<CardListSectionProps> = ({
  url,
  entityType,
  title,
  excludeId,
  onHasItems,
}) => {
  const { items, hasMore, loading, loadMore } = usePaginatedEntities(
    url,
    excludeId
  );

  useEffect(() => {
    if (onHasItems) {
      onHasItems(items.length > 0);
    }
  }, [items, onHasItems]);

  if (items.length === 0) {
    return null;
  }

  return (
    <Section title={title}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <Card
            key={item.id}
            id={item.id}
            title={item.name}
            entityType={entityType}
          />
        ))}
      </div>

      {hasMore && !loading && (
        <div className="mt-4 flex justify-center">
          <ButtonWithLabel onClick={loadMore} label={t("shared.loadMore")} />
        </div>
      )}
    </Section>
  );
};

export default CardListSection;
