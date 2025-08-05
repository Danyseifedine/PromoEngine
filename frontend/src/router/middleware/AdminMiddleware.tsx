import { useAuthStore } from "@/stores/authStore";
import { Navigate } from "react-router-dom";

interface AdminRouteProps {
    children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (user?.type !== "admin") {
    // Not admin, redirect to home or another page
    return <Navigate to="/" replace />;
  }

  // User is admin
  return <>{children}</>;
}