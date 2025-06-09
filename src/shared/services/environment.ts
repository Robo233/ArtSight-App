import { Capacitor } from "@capacitor/core";

type RemoteConfig = {
  VITE_API_URL_APP: string;
  VITE_API_URL_DASHBOARD: string;
};

let remoteConfig: RemoteConfig | null = null;

const fetchRemoteConfig = async () => {
  try {
    const response = await fetch("https://artsight-bucket.s3.eu-north-1.amazonaws.com/config.json");
    if (!response.ok) throw new Error("Failed to fetch config");
    remoteConfig = await response.json();
  } catch (error) {
    console.error("Error loading remote config:", error);
    remoteConfig = null;
  }
};

export const initializeEnvironment = async () => {
  if (Capacitor.getPlatform() === "android") {
    await fetchRemoteConfig();
  }
};

export const getAppApiUrl = (): string => {
  if (Capacitor.getPlatform() === "android") {
    return remoteConfig?.VITE_API_URL_APP ?? "";
  } else {
    return import.meta.env.VITE_API_URL_APP;
  }
};

export const getDashboardApiUrl = (): string => {
  if (Capacitor.getPlatform() === "android") {
    return remoteConfig?.VITE_API_URL_DASHBOARD ?? "";
  } else {
    return import.meta.env.VITE_API_URL_DASHBOARD;
  }
};
