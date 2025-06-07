import { Helmet, HelmetProvider } from "react-helmet-async";

interface PageTitleProps {
  title?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  const getPageTitle = (title?: string) => {
    return title ? `ArtSight - ${title}` : "ArtSight";
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>{getPageTitle(title)}</title>
      </Helmet>
    </HelmetProvider>
  );
};

export default PageTitle;
