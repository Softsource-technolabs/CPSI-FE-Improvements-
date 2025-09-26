import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginStart from './components/login/LoginStart';
import LoginAdPassword from './components/login/LoginAdPassword';
import LoginOptions from './components/login/LoginOptions';
import CreateAccount from './components/sign-up/CreateAccount';
import '../src/output.css';
import '../src/css/custom-sst.css';
import '../src/css/style.css';
import '../src/css/custom-media.css';
import '../src/css/bootstrap.min.css';
import '../src/css/custom-style-all-page.css';
import Swal from 'sweetalert2';
import { getLocationFromCoordinates }  from '../../utils/utils';

const ExternalRedirect = ({ to }: { to: string }) => {
  useEffect(() => {
    window.location.href = to;
  }, [to]);
  return null;
};

// Fast loading component - shows for minimal time
const QuickAuthCheck = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="text-center">
      <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
      <p className="text-sm text-gray-600">Verifying session...</p>
    </div>
  </div>
);

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  // Fast auth check with immediate response
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Method 1: Quick fetch with short timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000); // 1 second max

        const response = await fetch('http://localhost:3002/check-auth', {
          method: 'GET',
          credentials: 'include',
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache'
          }
        });

        clearTimeout(timeoutId);
        
        if (response.ok) {
          const result = await response.text();
          setIsLoggedIn(result === 'loggedIn');
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        // If request fails or times out, assume not logged in
        console.warn('Auth check failed:', error);
        setIsLoggedIn(false);
      } finally {
        setAuthCheckComplete(true);
      }
    };

    // Alternative: Check local storage first for instant response
    const checkLocalAuth = () => {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const lastLogin = localStorage.getItem('lastLogin');
      
      if (token && lastLogin) {
        const loginTime = new Date(lastLogin).getTime();
        const now = new Date().getTime();
        const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
        
        if (hoursSinceLogin < 24) { // Consider logged in if within 24 hours
          setIsLoggedIn(true);
          setAuthCheckComplete(true);
          return true;
        }
      }
      return false;
    };

    // Check local storage first for immediate response
    if (!checkLocalAuth()) {
      // If no local auth, do server check
      checkAuthStatus();
    }
  }, []);

  // Location permission (existing code)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locationDetails = await getLocationFromCoordinates(latitude, longitude);
          localStorage.setItem("locationAllowed", "true");
          localStorage.setItem("location", JSON.stringify(locationDetails));
        },
        (error) => {
          console.warn("User denied location access.");
          localStorage.setItem("locationAllowed", "false");
          localStorage.setItem("location", JSON.stringify("Access denied by User"));
        },
        { timeout: 5000 }
      );
    } else {
      console.warn("Geolocation not supported by this browser.");
      localStorage.setItem("locationAllowed", "false");
      localStorage.setItem("location", JSON.stringify("Geolocation Not Supported"));
    }
  }, []);

  // Show quick loading only for a very short time
  if (!authCheckComplete) {
    return <QuickAuthCheck />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? <ExternalRedirect to="http://localhost:3002/admin/appProfiles" /> : <LoginStart />
        }
      />
      <Route
        path="/admin/login"
        element={
          isLoggedIn ? <ExternalRedirect to="http://localhost:3002/admin/appProfiles" /> : <LoginStart />
        }
      />
      <Route
        path="/admin/loginPass"
        element={
          isLoggedIn ? <ExternalRedirect to="http://localhost:3002/admin/appProfiles" /> : <LoginAdPassword />
        }
      />
      <Route
        path="/admin/loginOptions"
        element={
          isLoggedIn ? <ExternalRedirect to="http://localhost:3002/admin/appProfiles" /> : <LoginOptions />
        }
      />
      <Route
        path="/admin/createAccount"
        element={
          isLoggedIn ? <ExternalRedirect to="http://localhost:3002/admin/appProfiles" /> : <CreateAccount />
        }
      />
      <Route path="*" element={<ExternalRedirect to="/" />} />
    </Routes>
  );
};

export default App;