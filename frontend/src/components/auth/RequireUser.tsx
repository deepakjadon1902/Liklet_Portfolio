import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getUserToken } from "@/lib/userAuth";

export default function RequireUser({ children }: { children: ReactNode }) {
  const location = useLocation();
  const token = getUserToken();
  if (token) return <>{children}</>;

  const redirect = `${location.pathname}${location.search || ""}`;
  return <Navigate to={`/auth?redirect=${encodeURIComponent(redirect)}`} replace />;
}
