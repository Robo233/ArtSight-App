import { useEffect, useState } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import "./styles/index.css";
import { ThemeProvider, useTheme } from "./shared/contexts/ThemeContext";
import i18n, { setStoredLanguageOrDefault } from "./i18n";
import LoadingScreen from "./LoadingScreen";
import ArtworkDetailPage from "./features/artworkDetail/pages/ArtworkDetailPage";
import ArtistPage from "./features/artist/pages/ArtistPage";
import GenrePage from "./features/genre/pages/GenrePage";
import ArtworkDetailForm from "./features/artworkDetail/pages/ArtworkDetailForm";
import ArtistForm from "./features/artist/pages/ArtistForm";
import GenreForm from "./features/genre/pages/GenreForm";
import { isAuthenticatedOrGuest } from "./shared/services/auth";
import Startpage from "./features/user/pages/Startpage";
import UserModeSelection from "./features/user/pages/UserModeSelection";
import { LayoutRoute } from "./LayoutRoute";
import Settings from "./features/settings/pages/Settings";
import AuthForm from "./features/user/pages/AuthForm";
import ArtworkForm from "./features/artwork/pages/ArtworkForm";
import ArtworkPage from "./features/artwork/pages/ArtworkPage";
import ExhibitionForm from "./features/exhibition/pages/ExhibitionForm";
import ExhibitionPage from "./features/exhibition/pages/ExhibitionPage";
import Home from "./features/user/pages/Home";
import Favorites from "./features/user/pages/Favorites";
import Yours from "./features/user/pages/Yours";
import RecentlyViewed from "./features/user/pages/RecentlyViewed";
import UserProfile from "./features/user/pages/UserProfile";
import Camera from "./features/artwork/pages/Camera";
import Maps from "./features/maps/pages/Maps";
import isMobile from "./shared/utils/isMobile";
import NotFoundPage from "./features/user/pages/NotFoundPage";
import BackButtonOverride from "./BackButtonOverride";
import useNotificationNavigation from "./shared/hooks/useNotificationNavigation";
import { Capacitor } from "@capacitor/core";
import { initializeEnvironment } from "./shared/services/environment";

const MainRoutes = () => {
  const theme = useTheme().theme;
  setStoredLanguageOrDefault();

  if (Capacitor.getPlatform() == "android") {
    useNotificationNavigation();
  }

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="app-container">
      <Switch>
        <Route exact path="/loading" component={LoadingScreen} />
        <Route exact path="/start-page" component={Startpage} />
        <Route exact path="/user-selection" component={UserModeSelection} />
        <Route exact path="/:mode(login|register)" component={AuthForm} />
        <LayoutRoute
          exact
          path="/settings"
          component={Settings}
          showFooter={false}
        />
        <LayoutRoute
          exact
          path="/artwork/:id/edit"
          component={ArtworkForm}
          showFooter={false}
        />
        <LayoutRoute
          exact
          path="/artwork/add"
          component={ArtworkForm}
          showFooter={false}
        />
        <LayoutRoute
          exact
          path="/artwork/:id"
          component={ArtworkPage}
          showFooter={false}
        />
        <LayoutRoute
          exact
          path="/artworkDetail/:id/edit"
          component={ArtworkDetailForm}
          showFooter={false}
        />
        <LayoutRoute
          exact
          path="/artworkDetail/add"
          component={ArtworkDetailForm}
          showFooter={false}
        />
        <LayoutRoute
          exact
          path="/artworkDetail/:id"
          component={ArtworkDetailPage}
          showFooter={false}
        />
        <LayoutRoute
          exact
          path="/exhibition/:id/edit"
          component={ExhibitionForm}
          showFooter={false}
        />
        <LayoutRoute
          exact
          path="/exhibition/add"
          component={ExhibitionForm}
          showFooter={false}
        />
        <LayoutRoute
          exact
          path="/exhibition/:id"
          component={ExhibitionPage}
          showFooter={false}
        />
        <LayoutRoute
          exact
          path="/artist/:id/edit"
          component={ArtistForm}
          showFooter={false}
        />
        <LayoutRoute
          exact
          path="/artist/add"
          component={ArtistForm}
          showFooter={false}
        />
        <LayoutRoute
          exact
          path="/artist/:id"
          component={ArtistPage}
          showFooter={false}
        />
        <LayoutRoute
          exact
          path="/genre/:id/edit"
          component={GenreForm}
          showFooter={false}
        />
        <LayoutRoute
          exact
          path="/genre/add"
          component={GenreForm}
          showFooter={false}
        />
        <LayoutRoute
          exact
          path="/genre/:id"
          component={GenrePage}
          showFooter={false}
        />
        <LayoutRoute exact path="/home" component={Home} />
        <LayoutRoute exact path="/favorites" component={Favorites} />
        <LayoutRoute exact path="/yours" component={Yours} />
        <LayoutRoute exact path="/recentlyViewed" component={RecentlyViewed} />
        <LayoutRoute path="/user-profile" component={UserProfile} />
        <LayoutRoute
          exact
          path="/user-selection-with-route"
          component={UserModeSelection}
        />
        <LayoutRoute exact path="/camera" component={Camera} />
        <LayoutRoute exact path="/maps" component={Maps} />
        <LayoutRoute component={NotFoundPage} />
        {/* This is needed in order to show the NotFoundPage, if an incorrect url is accessed which is not associated with a page */}
      </Switch>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      await initializeEnvironment();
      const authStatus = await isAuthenticatedOrGuest();
      setIsAuthenticated(authStatus);
      setAuthReady(true);
    };
    initializeApp();
  }, []);

  if (!authReady) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <BackButtonOverride />
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path="/"
              render={() => {
                const redirectPath =
                  isAuthenticated || !isMobile() ? "home" : "start-page";
                return <Redirect to={`/${redirectPath}`} />;
              }}
            />
            <Route path="/" component={MainRoutes} />
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </I18nextProvider>
  );
};

export default App;
