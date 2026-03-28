import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import Loader from "../components/Loader";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loader fullScreen text="Authenticating..." />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;