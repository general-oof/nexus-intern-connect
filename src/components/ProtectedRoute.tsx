
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  userType?: "student" | "startup";
}

const ProtectedRoute = ({ children, userType }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nexus-300"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If userType is specified, only allow users of that type
  if (userType && user.userType !== userType) {
    return <Navigate to="/" replace />;
  }

  // If user hasn't completed profile setup
  if (user && !user.profileCompleted && !["/student-profile", "/startup-profile"].includes(location.pathname)) {
    if (user.userType === "student") {
      return <Navigate to="/student-profile" replace />;
    } else if (user.userType === "startup") {
      return <Navigate to="/startup-profile" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
