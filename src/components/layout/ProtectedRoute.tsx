// components/layout/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ROUTES } from '../../constants/routes';
import type { UserRole } from '../../types/auth';
import { useEffect, useState } from 'react';


interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);
  const login = useAuthStore((state) => state.login);
  const location = useLocation();
  const [autoLoginChecked, setAutoLoginChecked] = useState(false);


    // Auto-login in development
    useEffect(() => {
      const shouldAutoLogin =
        import.meta.env.DEV &&
        import.meta.env.VITE_DEV_AUTO_LOGIN !== 'false' &&
        !isAuthenticated;

      if (shouldAutoLogin) {
        login('dev-user-1', 'user', 'dev-token-123');
      }

      // Mark as checked after first render
      setAutoLoginChecked(true);
    }, []); // Only run once on mount


  // Wait for auto-login check before redirecting
  if (!autoLoginChecked) {
    return null; // or a loading spinner
  }

  if (!isAuthenticated) {
    // Save where they were trying to go
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Wrong role - redirect to home
    return <Navigate to={ROUTES.MAP} replace />;
  }

  return <>{children}</>;
};