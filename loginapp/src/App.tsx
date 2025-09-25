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

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
//  useEffect(() => {
//   const iframe = document.createElement('iframe');
//   iframe.style.display = 'none';
//   // iframe.src = 'http://localhost:3002/check-auth';
//   document.body.appendChild(iframe);

//   const handleMessage = (event: MessageEvent) => {
//     if (event.origin === 'http://localhost:3002') {
//       setIsLoggedIn(event.data === 'loggedIn');
//     }
//   };

//   window.addEventListener('message', handleMessage);
//   return () => {
//     window.removeEventListener('message', handleMessage);
//     document.body.removeChild(iframe);
//   };
// }, []);

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

  //   if (isLoggedIn === null) {
  //   return (
  //     <div className="flex items-center justify-center h-screen text-lg text-gray-700">
  //       <span className="animate-pulse">🔐 Checking login status...</span>
  //     </div>
  //   );
  // }

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
            <div>
              Password page
            </div>
            // isLoggedIn ? <ExternalRedirect to="http://localhost:3002/admin/appProfiles" /> : <LoginAdPassword />
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
