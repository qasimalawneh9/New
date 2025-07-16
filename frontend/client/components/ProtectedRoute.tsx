import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function ProtectedRoute({
  children,
  requireAuth = true,
}: ProtectedRouteProps) {
  const { user } = useAuth();

  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
