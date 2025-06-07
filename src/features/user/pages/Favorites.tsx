import ProtectedEntityList from "../../../shared/components/ProtectedEntityList";

const favoritesConfig = {
  additionalParams: {
    isFavorited: "true",
  },
};

const Favorites = () => {
  return (
    <ProtectedEntityList
      title="shared.favorites"
      config={favoritesConfig}
      loginMessageKey="favorites.loginMessage"
      noEntitiesKey="favorites.noEntities"
    />
  );
};

export default Favorites;
