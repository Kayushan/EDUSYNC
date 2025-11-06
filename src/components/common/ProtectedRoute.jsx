import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import Spinner from './Spinner';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null,
  redirectTo = '/login',
  loadingComponent = null
}) => {
  const { isAuthenticated, loading, authLoading, user } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading || authLoading) {
    return loadingComponent || (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Spinner size="lg" />
        </motion.div>
      </div>
    );
  }

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If role is required, check user role
  if (requiredRole) {
    const userRole = user?.user_metadata?.role;
    
    // Check role hierarchy (principal > administrator > teacher > student)
    const roleHierarchy = {
      principal: 4,
      administrator: 3,
      teacher: 2,
      student: 1
    };
    
    const userRoleLevel = roleHierarchy[userRole] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
    
    if (userRoleLevel < requiredRoleLevel) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-8 max-w-md mx-4"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page. This area requires {requiredRole} privileges or higher.
            </p>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </motion.div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedRoute;