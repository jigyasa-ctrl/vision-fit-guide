
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="fitvision-gradient rounded-full w-12 h-12 animate-spin flex items-center justify-center">
          <div className="bg-white w-10 h-10 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login and remember where the user was trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
