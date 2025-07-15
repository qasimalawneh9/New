import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface DashboardRouterProps {
  children?: React.ReactNode;
}

export function DashboardRouter({ children }: DashboardRouterProps) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      // User is not authenticated, redirect to login
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (user && location.pathname === "/dashboard") {
      // User is authenticated, redirect to appropriate dashboard
      switch (user.type) {
        case "admin":
          navigate("/admin");
          break;
        case "teacher":
          navigate("/teacher-dashboard");
          break;
        case "student":
          navigate("/student-dashboard");
          break;
        default:
          navigate("/");
      }
    }
  }, [user, isLoading, navigate, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default DashboardRouter;
