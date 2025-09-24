// main-app/src/components/AuthGuard.tsx
import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  return !!localStorage.getItem("loginResponse");
};

const AuthGuard = () => {
  if (isAuthenticated()) {
    return <Outlet />;
  } else {
    // Redirect to external login app
    window.location.href = "http://localhost:3002/admin/login";
    return null;
  }
};

export default AuthGuard;
