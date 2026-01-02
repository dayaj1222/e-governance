import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const ProtectedRoute = ({ children, type }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // If type is specified, check user type
  if (type && user?.type !== type) {
    const redirectPath =
      user?.type === "citizen" ? "/citizen/dashboard" : "/authority/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
