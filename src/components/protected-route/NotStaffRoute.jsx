import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const NotStaffRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.is_staff) {
    return <Navigate to="/forbidden" />;
  }

  return children;
}

export default NotStaffRoute;