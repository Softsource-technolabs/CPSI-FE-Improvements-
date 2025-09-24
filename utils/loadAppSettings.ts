//@ts-nocheck
import { decrypt, encrypt, encryptKeyToKeyIv } from "./aesUtils";
import type { AppSettings } from "../utils/appSettings";

// Recursively decrypt any encrypted fields (AES-CBC)
const recursivelyDecrypt = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(recursivelyDecrypt);

  if (typeof obj === "object" && obj !== null) {
    const newObj: any = {};
    for (const key in obj) {
      const value = obj[key];
      try {
        newObj[key] =
          typeof value === "string" && value.startsWith("U2FsdGVkX1")
            ? decrypt(value)
            : recursivelyDecrypt(value);
      } catch (e) {
        console.warn(`[decrypt] Failed to decrypt key "${key}":`, e);
        newObj[key] = value;
      }
    }
    return newObj;
  }

  return obj;
};

// Encrypt and split the base64 string into AESKey + AESIV using "OUA"
const deriveAesKeyAndIv = (encryptionKey: string): { AESKey: string; AESIV: string } => {
  try {
    const encrypted = encryptKeyToKeyIv(encryptionKey); // returns 'base64KeyOUAbase64IV'
    console.log("[deriveAesKeyAndIv] Encrypted value:", encrypted);

    const [AESKey, AESIV] = encrypted.split("OUA");

    if (!AESKey || !AESIV) {
      throw new Error("Encrypted key must contain 'OUA' separator");
    }

    return { AESKey, AESIV };
  } catch (error) {
    console.error("[deriveAesKeyAndIv] Error deriving keys:", error);
    throw error;
  }
};

// Load and decrypt app settings, then attach to global window
export const loadAppSettings = async (): Promise<AppSettings> => {
  try {
    console.log("[loadAppSettings] Fetching appSettings.json...");

    const response = await fetch("/appSettings.json");
    if (!response.ok) {
      console.error("[loadAppSettings] Failed to fetch appSettings.json:", response.statusText);
      throw new Error("Failed to load appSettings.json");
    }

    const rawSettings = await response.json();

    const decryptedSettings = recursivelyDecrypt(rawSettings);

    const encryptionKey = decryptedSettings?.EncryptionKey;
    if (encryptionKey) {

      const { AESKey, AESIV } = deriveAesKeyAndIv(encryptionKey);
      decryptedSettings.aesSettings = {
        AESKey,
        AESIV,
      };
    } else {
      console.warn("[loadAppSettings] No EncryptionKey found");
    }

    window.__APP_SETTINGS__ = decryptedSettings;

    return decryptedSettings;
  } catch (error) {
    console.error("[loadAppSettings] Error:", error);
    throw error;
  }
};
