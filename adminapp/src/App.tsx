//@ts-nocheck
import React, { lazy, Suspense, useEffect, useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { ContentLayout } from "./pages/content";
import HeaderLayout from "./pages/header";
import AuthGuard from "./components/AuthGuard";
import CheckAuth from "./components/CheckAuth";
// import "../output.css";
import defaultSetting from "../../constant/defaultSetting.json";
import defaultTextSettings from '../../constant/defaultTextSettings.json'
import { getLocationFromCoordinates, getMacIPDetails, getSysdetails } from "../../utils/utils";
import RootAppService from "../../services/rootAppService";
import { applyDynamicStyles, getMergedSettings, mergeWithDefaults } from "../../utils/utils";
import Swal from "sweetalert2";
import { loadAppSettings } from "../../utils/loadAppSettings";
import MaintenancePage from './pages/maintenancePage';
import TokenChecker from './pages/TokenChecker'; 


const Login = React.lazy(() => import("../../loginapp/src/App") as Promise<{ default: React.ComponentType }>);
const LoginPass = React.lazy(() => import("../../loginapp/src/components/login/LoginAdPassword") as Promise<{ default: React.ComponentType }>);

const NotFound = lazy(() => import("./pages/NotFound"));

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isLoginPage = location.pathname === "/admin/login" || location.pathname === "/admin/loginPass";
  const showHeader = isAdminRoute && !isLoginPage;

  return (
    <>
      {showHeader && <HeaderLayout />}
      <Routes>
        <Route
          path="/admin/login"
          element={
            localStorage.getItem("loginResponse") ? (
              <Navigate to="/admin/appProfiles" replace />
            ) : (
              <Login />
            )
          }
        />
         <Route
          path="/admin/loginPass"
          element={
            localStorage.getItem("loginResponse") ? (
              <Navigate to="/admin/appProfiles" replace />
            ) : (
              <LoginPass />
            )
          }
        />
        <Route path="/check-auth" element={<CheckAuth />} />
        <Route element={<AuthGuard />}>
          <Route path="/admin/*" element={<ContentLayout />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const RootApp: React.FC = () => {
  const [checking, setChecking] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);


  const getStyleInit = async () => {
    const locationInfo = localStorage.getItem("locationInfo");

    const res = await RootAppService.getLayoutSettings(10, {
      headers: {
        "Content-Type": "application/json",
        'X-System-location-Info': locationInfo,
      },
    });
    if (res?.data?.settings) {
      const updatedSettings: { [key: string]: string } = {};
      Object.entries(res.data.settings).forEach(([key, value]) => {
        updatedSettings[key] = String(value || "");
      });

      const merged = getMergedSettings(updatedSettings, defaultSetting);
      applyDynamicStyles(merged, defaultSetting);
    }
  }

  const getTextInit = async () => {

    const locationInfo = localStorage.getItem("locationInfo");

    const response = await RootAppService.getTextSettings(10, {
      headers: {
        "Content-Type": "application/json",
        'X-System-location-Info': locationInfo,
      },
    });

    const serverTextSettings = response;

    if (serverTextSettings && Object.keys(serverTextSettings).length > 0) {
      const merged = mergeWithDefaults(defaultTextSettings, serverTextSettings);
      // reset(merged);
      // setTextSettings(merged);
    }
  }

  // const getTimezoneInit = async () => {

  // }

const getInit = async () => {
  try {
    const Loadsettings = await loadAppSettings();
    window.__APP_SETTINGS__ = Loadsettings;
  } catch (err) {
    console.error("Failed to load settings", err);
    setLoadFailed(true);  
    return; 
  }

  const systemInfo = getSysdetails();
  localStorage.setItem("system", JSON.stringify(systemInfo));

  const ip = await getMacIPDetails();
  localStorage.setItem("ipaddress", ip);

  let locationInfo: any = {
    location: "Access denied by User",
    system: systemInfo,
    ipaddress: ip,
  };

  if (navigator.geolocation) {
    await new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationDetails = await getLocationFromCoordinates(
            position.coords.latitude,
            position.coords.longitude
          );

          locationInfo.location = locationDetails;
          localStorage.setItem("locationDetails", JSON.stringify(locationInfo));

          resolve();

          // Swal.fire({
          //   icon: "success",
          //   title: "Location Access Granted",
          //   text: "Location access has been successfully granted.",
          //   confirmButtonText: "OK",
          // });
        },
        async () => {
          localStorage.setItem("locationDetails", JSON.stringify({ status: "Access denied by User" }));
          // Swal.fire({
          //   icon: "warning",
          //   title: "Location Access Denied",
          //   text: "Location access was denied by the user. Some features may be limited.",
          //   confirmButtonText: "OK",
          // });
          resolve();
        }
      );
    });
  } else {
    localStorage.setItem("locationDetails", JSON.stringify({ status: "Geolocation Not Supported" }));
    Swal.fire({
      icon: "warning",
      title: "Geolocation Not Supported",
      text: "Your browser does not support geolocation. Some features may be limited.",
      confirmButtonText: "OK",
    });
  }

  getStyleInit();
};


  //    const applyDynamicStyles = (settings: { [key: string]: string }) => {
  //     const root = document.documentElement;
  //     const body = document.body;

  //     Object.entries(settings).forEach(([key, value]) => {
  //         if (value) {
  //             root.style.setProperty(`--${key}`, value);
  //         }
  //     });

  //     // Apply fontFamily globally
  //     if (settings.fontFamily) {
  //       body.style.fontFamily = settings.fontFamily;
  //   } else {
  //       body.style.fontFamily = "sans-serif";
  //   }
  // };

  useEffect(() => {
    const cached = localStorage.getItem("customStyle");
    if (cached) {
      try {
        const parsedSettings = JSON.parse(cached);

        applyDynamicStyles(parsedSettings, defaultSetting);

      } catch (err) {
        console.error("Error parsing localStorage settings:", err);
      }
    }
  }, [])

  useEffect(() => {
    getInit()
    const params = new URLSearchParams(window.location.search);
    const loginData = params.get("loginData");
    if (loginData) {
      try {
        localStorage.setItem("loginResponse", decodeURIComponent(loginData));
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.error("Failed to parse loginData from URL:", e);
      }
    }
  }, []);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 15;
    const interval = setInterval(() => {
      if (localStorage.getItem("loginResponse")) {
        setChecking(false);
        clearInterval(interval);
      } else if (++attempts >= maxAttempts) {
        setChecking(false);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (checking) return <div>Loading...</div>;
  // if (loadFailed) return <MaintenancePage />;

  return (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <TokenChecker /> 
      {loadFailed ? <MaintenancePage /> : <AppRoutes />}
    </Suspense>
  </Router>
);
};

export default RootApp;