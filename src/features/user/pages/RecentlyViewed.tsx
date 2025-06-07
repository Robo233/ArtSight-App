import ProtectedEntityList from "../../../shared/components/ProtectedEntityList";

const recentlyViewedConfig = {
  additionalParams: {
    isRecentlyViewed: "true",
  },
};

const RecentlyViewed = () => {
  return (
    <ProtectedEntityList
      title="shared.recentlyViewed"
      config={recentlyViewedConfig}
      loginMessageKey="recentlyViewed.loginMessage"
      noEntitiesKey="recentlyViewed.noEntities"
    />
  );
};

export default RecentlyViewed;
