import type { AppSettings } from "../utils/appSettings";
declare global {
  interface Window {
    __APP_SETTINGS__?: AppSettings;
  }
}

export {};
