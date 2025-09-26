//@ts-nocheck

import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  return !!sessionStorage.getItem("loginResponse");
};

const AuthGuard = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="http://localhost:3002/admin/login" replace />;
};

export default AuthGuard;
