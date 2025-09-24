import axios from "axios";
import Swal from "sweetalert2";
import _ from "lodash";
import { loginRedirectCallWithDataStore, googleLoginWithData, microsoftLoginwithdata } from "../common/RedirectPathMange";
import { useGoogleLogin } from "@react-oauth/google";
// import { MsalProvider, useMsal } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig, loginRequest } from './msalConfig';
import { jwtDecode } from "jwt-decode";


interface LoginData {
  email: string;
  password: string;
}

interface AppSettings {
  AppSettings: {
    BaseUrlPath: string;
    WebServicePath: string;
  };
  clientId: string;
  ClientSecret: string;
}

// Function to capitalize the first letter of each key in an object
const capitalizeKeys = (obj: Record<string, any>): Record<string, any> => {
  return _.mapKeys(obj, (value: any, key: any) => key.charAt(0).toUpperCase() + key.slice(1));
};

const fetchAppSettings = async (): Promise<AppSettings | "error"> => {
  try {
    const response = await axios.get<AppSettings>("/appSettings.json");
    return response.data;
  } catch (error) {
    Swal.fire({
      title: "Oops, Something Went Wrong",
      text: "We encountered an issue while trying to complete your request. This might be due to a system error. Please try again later, or reach out to your system administrator or support team for assistance.",
      icon: "error",
      width: "600px",
      confirmButtonText: "Ok",
    });
    return "error";
  }
};


let FileFound: AppSettings | "error";

const initializeFileFound = async () => {
  FileFound = await fetchAppSettings();
};

initializeFileFound();

// Function to get the UI style
export const getUiStyle = async (): Promise<any> => {
  if (FileFound === "error") return;
  try {
    Swal.showLoading();
    const response = await axios.get(`${FileFound.AppSettings.BaseUrlPath}api/Settings/GetAppLauncherSettings`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json",
      },
    });
    const formattedData = capitalizeKeys(response.data.data);
    localStorage.setItem("customStyle", JSON.stringify(formattedData));
  } catch (error) {
    localStorage.setItem("customStyle", JSON.stringify({}));
    console.error("Failed to fetch UI style settings", error);
  }
};

// Function to normal user login
export const loginService = async (data: LoginData): Promise<void> => {
  if (!data.email || !data.password) {
    Swal.fire({ title: "Please Enter Valid Credential", icon: "warning" });
    return;
  }

  try {
    Swal.showLoading();

    const response = await axios.post(`${(FileFound as AppSettings).AppSettings.WebServicePath}api/Auth/Login`, data, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json",

      },
    });

    if (response.data.success) {
      Swal.fire({ title: "Login Successful", background: "#408000", icon: "success", showConfirmButton: false, allowOutsideClick: false });
      await getUiStyle();
      localStorage.setItem('ALoginMethod', 'Normal Login');
      loginRedirectCallWithDataStore(response.data);
    } else {
      Swal.fire({
        title: response?.data?.message || "Login Failed",
        icon: "error",
        background: "#fccdcd",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  } catch (error) {
    Swal.fire({
      title: "Please Enter Valid Credential",
      icon: "error",
      background: "#fccdcd",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

interface JwtPayload {
  exp: number;
  iat: number;
  [key: string]: any;
}

export const adLoginService = async (data: LoginData): Promise<any> => {
  if (!data.email || !data.password) {
    Swal.fire({ title: "Please Enter Valid Credential", icon: "warning" });
    return false;
  }

  try {
    Swal.showLoading();

    if (FileFound === "error") {
      await initializeFileFound();
      if (FileFound === "error") {
        throw new Error("Unable to load application settings");
      }
    }

    const sysdetail = localStorage.getItem("system") || "{}";
    const ipdetails = localStorage.getItem("ipaddress") || "";
    const location = localStorage.getItem("location") || "{}";

    const systemInfo = JSON.parse(sysdetail);
    const locationDetails = JSON.parse(location);

    const apiEndpoint = `https://portal4all.com/AuthBridgeDev/api/Account/AD-Login`;

    const payload = {
      EmailAddress: data.email,
      Password: data.password,
    };

    const response = await axios.post(apiEndpoint, payload, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "X-System-location-Info": JSON.stringify({
          location: locationDetails,
          system: systemInfo,
          ipaddress: ipdetails,
        }),
      },
    });

    console.log("AD Login response:", response.data);

    if (response && response.data) {
      const { token, expiresInMinutes } = response.data.data || {};

      if (token) {
        try {
          const decoded: JwtPayload = jwtDecode(token);
          const expiryFromToken = decoded.exp * 1000;

          // const expiryFromApi = Date.now() + 1 * 60 * 1000; // 1 minute
          // const expiryFromApi = Date.now() + 2 * 60 * 1000; // 2 minutes
          const expiryFromApi = Date.now() + (expiresInMinutes || 15) * 60 * 1000; // 15 minutes

          localStorage.setItem("authToken", token);
          localStorage.setItem("tokenExpiry", expiryFromApi.toString());
          localStorage.setItem("tokenExpiryFallback", expiryFromApi.toString());

          console.log("Token stored, expires at:", new Date(expiryFromApi).toUTCString());

        } catch (decodeError) {
          console.warn("Failed to decode JWT, using API expiry only");
          const expiryFromApi = Date.now() + (expiresInMinutes || 15) * 60 * 1000;
          localStorage.setItem("authToken", token);
          localStorage.setItem("tokenExpiry", expiryFromApi.toString());
        }
      }

      localStorage.setItem("customStyle", JSON.stringify({}));
      await getUiStyle();
      return response.data;
    }

    return false;
  } catch (error: any) {
    console.error("AD Login Error:", error);

    let errorMessage = "Please check your credentials and try again";
    if (error.response?.status === 404) {
      errorMessage = "Login service is currently unavailable. Please try again later.";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    Swal.fire({
      title: "Login Failed",
      text: errorMessage,
      icon: "error",
      background: "#fccdcd",
      showConfirmButton: false,
      timer: 1500,
    });
    return false;
  }
};

// function for google oauth login
export const useGoogleOauthLogin = () => {
  return useGoogleLogin({
    onSuccess: (codeResponse: any) => {
      axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${codeResponse.access_token}`, {
        headers: {
          Authorization: `Bearer ${codeResponse.access_token}`,
          Accept: 'application/json'
        }
      }).then(async (res: any) => {
        localStorage.setItem('Aname', res.data.name);
        localStorage.setItem('customStyle', JSON.stringify({}));
        await getUiStyle();
        googleLoginWithData({ ...res.data, ...{ token: codeResponse.access_token } })
      }).catch((err: any) => {
        Swal.fire({
          title: "Something went wrong with google login, please try after sometime",
          icon: "error",
          background: "#fccdcd",
          showConfirmButton: false,
          timer: 1500,
        });
      });
    },
    onError: (error: any) => {
      Swal.fire({
        title: "Something went wrong with google login, please try after sometime",
        icon: "error",
        background: "#fccdcd",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
};

const msalInstance = new PublicClientApplication(msalConfig);

// function for Microsoft oauth login
export const useMicrosoftOauthLogin = async () => {
  return await msalInstance.loginPopup(loginRequest).then(async (response: any) => {
    localStorage.setItem('microsoft', JSON.stringify(response))
    localStorage.setItem('MicroAcc', JSON.stringify(response.account))
    localStorage.setItem('customStyle', JSON.stringify({}));
    microsoftLoginwithdata(response)
    localStorage.setItem('Aname', response.account.name || 'Anonymous');
    await getUiStyle();
  }).catch((error: any) => {
    Swal.fire({
      title: "Something went wrong with Microsoft login, please try after sometime",
      icon: "error",
      background: "#fccdcd",
      showConfirmButton: false,
      timer: 1500,
    });
  });
}

// Function for SAML login
export const SamlLogin = async (): Promise<any> => {
  try {
    Swal.showLoading();
    const response = await axios.get(`${(FileFound as AppSettings).AppSettings.BaseUrlPath}api/Account/Microsoft-SAML/${'test@gmail.com'}`, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-Type": "application/json",
      },
    });

    if (response) {
      window.open(response.data.data, '_blank');
    }
  } catch (error) {
    console.log('error :', error);
  }
};