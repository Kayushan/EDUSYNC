import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Hook for checking authentication status
export const useRequireAuth = () => {
  const { isAuthenticated, loading, user } = useAuth();
  
  if (loading) {
    return { loading: true, authenticated: false };
  }
  
  if (!isAuthenticated) {
    return { loading: false, authenticated: false, user: null };
  }
  
  return { loading: false, authenticated: true, user };
};

// Hook for role-based access
export const useRequireRole = (requiredRole) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return { loading: true, authorized: false };
  }
  
  if (!isAuthenticated) {
    return { loading: false, authorized: false, reason: 'not_authenticated' };
  }
  
  const userRole = user?.user_metadata?.role;
  
  if (!userRole) {
    return { loading: false, authorized: false, reason: 'no_role' };
  }
  
  // Check role hierarchy (principal > administrator > teacher > student)
  const roleHierarchy = {
    principal: 4,
    administrator: 3,
    teacher: 2,
    student: 1
  };
  
  const userRoleLevel = roleHierarchy[userRole] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole] || 0;
  
  const authorized = userRoleLevel >= requiredRoleLevel;
  
  return {
    loading: false,
    authorized,
    userRole,
    reason: authorized ? null : 'insufficient_permissions'
  };
};