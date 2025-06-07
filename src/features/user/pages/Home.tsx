import { t } from "i18next";
import EntityListBase from "../../../shared/components/EntityListBase";

const Home = () => {
  return (
    <EntityListBase
      title={t("shared.home")}
      noEntitiesKey="shared.noResults"
      displayBackButton={false}
    />
  );
};

export default Home;
