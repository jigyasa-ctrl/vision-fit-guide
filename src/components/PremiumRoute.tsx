
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PremiumRouteProps {
  children: React.ReactNode;
}

const PremiumRoute: React.FC<PremiumRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, canAccessPremiumFeatures } = useAuth();
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
    // Redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!canAccessPremiumFeatures) {
    // Redirect to paywall
    return <Navigate to="/paywall" replace />;
  }

  return <>{children}</>;
};

export default PremiumRoute;
