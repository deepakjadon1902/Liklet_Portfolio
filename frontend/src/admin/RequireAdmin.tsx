import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAdminToken } from "./adminAuth";

export default function RequireAdmin() {
  const token = getAdminToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

