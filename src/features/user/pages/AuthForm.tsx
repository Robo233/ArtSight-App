import React, { useEffect, useState } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { t } from "i18next";
import Section from "../../../shared/components/Section";
import PageTitle from "../../../shared/components/PageTitle";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { GenericOAuth2 } from "@capacitor-community/generic-oauth2";
import GoogleSignInButton from "./GoogleSignInButton";
import HeaderWithSettingsAndTitle from "../../../shared/navigation/headers/HeaderWithSettingsAndTitle";

const AuthForm: React.FC = () => {
  const { mode } = useParams<{ mode: string }>();
  const isLogin = mode === "login";
  const historyRouter = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get("redirectTo") || "home";
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setErrorMessage(null);
  }, [mode]);

  const googleNativeLogin = async () => {
    try {
      const response = await GenericOAuth2.authenticate({
        authorizationBaseUrl: "https://accounts.google.com/o/oauth2/auth",
        accessTokenEndpoint: "https://www.googleapis.com/oauth2/v4/token",
        scope: "email profile",
        resourceUrl: "https://www.googleapis.com/userinfo/v2/me",
        android: {
          appId: `${import.meta.env.VITE_GOOGLE_CLIENT_ID_ANDROID}`,
          responseType: "code",
          redirectUrl: "com.artsight.android:/",
        },
      });
      const platform = Capacitor.getPlatform();
      const tokenToSend =
        platform === "android"
          ? response.access_token_response?.id_token
          : response.authorization_response?.id_token;

      const backendResponse = await fetch(
        `${import.meta.env.VITE_API_URL_APP}/auth/google-login/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenToSend }),
        }
      );
      if (backendResponse.ok) {
        const data = await backendResponse.json();
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("isGuest", "false");
        console.log("redirectTo: ", redirectTo);
        historyRouter.push(redirectTo);
      } else {
        const errorData = await backendResponse.json();
        console.error("Google login error:", errorData.error);
        setErrorMessage(errorData.error || "Login failed");
      }
    } catch (error) {
      console.error("Google OAuth rejected", error);
      setErrorMessage("Google authentication failed.");
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      setTimeout(async () => {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL_APP}/auth/google-login/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: credentialResponse.credential }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userEmail", data.email);
          localStorage.setItem("isGuest", "false");
          historyRouter.push(redirectTo);
        } else {
          const errorData = await response.json();
          console.error("Google login error:", errorData.error);
          setErrorMessage(errorData.error || "Login failed");
        }
      }, 1000);
    } catch (error) {
      console.error("Google login error:", error);
      setErrorMessage("Google authentication failed.");
    }
  };

  const platform = Capacitor.getPlatform();

  return (
    <>
      <HeaderWithSettingsAndTitle
        title={t("authForm.authentication")}
        displayBackButton
        displaySettingsButton
      />
      <PageTitle title={t("authForm.authentication")} />
      <div className="responsive-container">
        <div className="flex items-center justify-center pt-12">
          <img
            src={"/logo.png"}
            className="w-36 h-auto"
            alt="Logo"
            draggable="false"
          />
        </div>
        <Section title={isLogin ? t("shared.logIn") : t("authForm.signUp")} />
        <div className="flex flex-col items-center justify-center py-2">
          {errorMessage && (
            <p className="text-red-500 text-sm pt-4">{errorMessage}</p>
          )}
          <div className="flex items-center justify-center w-full mb-10">
            <hr className="w-1/5 border-t border-text" />
            <span className="mx-2 text-background-color-shadow">
              {t("authForm.continueWith")}
            </span>
            <hr className="w-1/5 border-t border-text" />
          </div>
          <div className="flex justify-center items-center [&_span]:text-[#1F1F1F] [&_span]:text-[14px] [&_span]:leading-[20px] [&_span]:font-medium [&_span]:font-roboto">
            {/* This is needed to make the text look like the original one, according to https://developers.google.com/identity/branding-guidelines */}
            {platform === "web" ? (
              <GoogleOAuthProvider
                clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
              >
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => console.log("Login Failed")}
                />
              </GoogleOAuthProvider>
            ) : (
              <GoogleSignInButton onClick={googleNativeLogin} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
