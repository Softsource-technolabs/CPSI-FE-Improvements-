//@ts-nocheck
export const checkAuth = () => {
    const isLoggedIn = !!localStorage.getItem('loginResponse');
    return(
        isLoggedIn
    )
}

export const manageJSONParse = (jsonObj: any) => {
     let returnJsonObj = {};
     try {
        returnJsonObj = (typeof jsonObj === 'string') ? JSON.parse(jsonObj) : jsonObj;
     }
     catch{
        returnJsonObj = jsonObj; 
     }
     return returnJsonObj
}

export const getMergedSettings = (customSettings: { [key: string]: string }, defaultSetting) => ({
        ...defaultSetting,
        ...customSettings,
    });

export const applyDynamicStyles = (settings: { [key: string]: string }, defaultSetting) => {
        const root = document.documentElement;
        const mergedSettings = { ...defaultSetting, ...settings };

        Object.entries(mergedSettings).forEach(([key, value]) => {
            if (value) root.style.setProperty(`--${key}`, value);
        });

        document.body.style.fontFamily = mergedSettings.fontFamily || "sans-serif";
    };

export function mergeWithDefaults<T extends object, U extends Partial<T>>(defaultObj: T, customObj: U): T {
  const result = { ...defaultObj };

  (Object.keys(customObj) as (keyof T)[]).forEach((key) => {
    if (customObj[key] !== undefined) {
      result[key] = customObj[key] as T[keyof T];
    }
  });

  return result;
}

export const checkLocationAccess = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        localStorage.setItem("location", JSON.stringify(coords));
        resolve(position);
      },
      (error) => {
        console.error("Geolocation error:", error);
        reject(new Error("Location access denied or unavailable"));
      },
      { timeout: 5000 }
    );
  });
};

export const isTokenExpired = (): boolean => {
  const expiry = localStorage.getItem("tokenExpiry");
  if (!expiry) {
    return true;
  }
  return Date.now() > parseInt(expiry, 10);
};

export const clearAuthData = (): void => {
  localStorage.removeItem("loginResponse");
  localStorage.removeItem("tokenExpiry");
  localStorage.removeItem("authToken");
};

export const getTokenExpiryUTC = (): string | null => {
  const expiry = localStorage.getItem("tokenExpiry");
  if (!expiry) return null;
  return new Date(parseInt(expiry, 10)).toUTCString();
};

import axios from "axios";
import { LocationInfo } from "../analyticsapp/src/components/types";

const platform = require('platform');

// export function mergeWithDefaults<T extends object, U extends Partial<T>>(defaultObj: T, customObj: U): T {
//   const result = { ...defaultObj };

//   (Object.keys(customObj) as (keyof T)[]).forEach((key) => {
//     if (customObj[key] !== undefined) {
//       result[key] = customObj[key] as T[keyof T];
//     }
//   });

//   return result;
// }

export const getSysdetails = () => {
  var info = platform.parse(navigator?.userAgent);
  return info
}

export const getMacIPDetails = async () => {
  const response = await axios.get('https://api.ipify.org/?format=json');
  return response.data.ip
}

export const getMacAddress = (): string => {
  let mac = localStorage.getItem("simulated-mac-address");

  if (!mac) {
    const hexChars = "0123456789abcdef";
    let rawMac = "";
    for (let i = 0; i < 12; i++) {
      rawMac += hexChars[Math.floor(Math.random() * 16)];
    }

    mac = rawMac.match(/.{1,2}/g)!.join(":").toUpperCase();
    localStorage.setItem("simulated-mac-address", mac);
  }

  return mac;
};

export const convertTimezone = (utcString: string) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const utcDate = new Date(utcString);
  const mm = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(utcDate.getUTCDate()).padStart(2, '0');
  const yyyy = utcDate.getUTCFullYear();
  const formattedUtcDate = `${mm}-${dd}-${yyyy}`;

  const formattedTime = utcDate.toLocaleTimeString('en-IN', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const utcOffset = getUTCOffset(timeZone);

  const timezoneInfo = {
    timeZone,
    formattedTime,
    utcOffset,
    rawDate: utcDate.toISOString(),
    formattedUtcDate,
  };

  localStorage.setItem('user-timezone', JSON.stringify(timezoneInfo));
  return timezoneInfo;
};

function getUTCOffset(timeZone: string): string {
  const date = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'shortOffset',
    hour: '2-digit',
  }).formatToParts(date);

  const offset = parts.find(part => part.type === 'timeZoneName')?.value ?? '';
  return offset.replace('UTC', '');
}


export async function getLocationFromCoordinates(lat: number, lng: number): Promise<LocationInfo> {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;

  try {
    const response = await axios.get(url, {
      headers: {
        "Accept-Language": "en",
        // "User-Agent": "YourApp/1.0 (your-email@example.com)"
      }
    });

    const data = response.data;

    if (data?.address) {
      const {
        city,
        municipality,
        town,
        village,
        county,
        state_district,
        city_district,
        suburb,
        state,
        country
      } = data.address;

      const resolvedCity =
        city ||
        town ||
        municipality ||
        state_district ||
        county ||
        city_district ||
        village ||
        suburb || 
        "N/A";

      const locationInfo: LocationInfo = {
        city: resolvedCity,
        suburb: suburb || "N/A",
        state: state || "N/A",
        country: country || "N/A",
        lat,
        lng
      };
      localStorage.setItem("location", JSON.stringify(locationInfo));
      return locationInfo;
    }
  } catch (error) {
    console.error("Error fetching location from Nominatim:", error);
  }

  const fallback: LocationInfo = {
    city: "N/A",
    suburb: "N/A",
    state: "N/A",
    country: "N/A",
    lat,
    lng
  };

  localStorage.setItem("location", JSON.stringify(fallback));
  return fallback;
}

