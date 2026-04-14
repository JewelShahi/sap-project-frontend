import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const RoleProtectedRoute = ({ children, roleRequired }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;

  // Logic: Only allow access if user is admin
  if (roleRequired === "admin" && !user?.is_superuser && user?.role !== "admin") {
    return <Navigate to="/forbidden" />;
  }
  return children;
};

export default RoleProtectedRoute;