import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (!user || !user.roles.includes("admin")) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

