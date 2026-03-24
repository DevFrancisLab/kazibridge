import { Navigate, useLocation } from 'react-router-dom';

const isAuthenticated = () => {
  const token = localStorage.getItem('accessToken');
  return !!token;
};

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRole?: 'CLIENT' | 'FREELANCER';
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const role = localStorage.getItem('role');
  if (!role) {
    return <Navigate to="/login" replace />;
  }

  const location = useLocation();
  const pathname = location.pathname;

  // Global guard: if user tries to visit the other role's dashboard, redirect to correct dashboard.
  if (pathname.startsWith('/client-dashboard') && role !== 'CLIENT') {
    return <Navigate to="/freelancer-dashboard" replace />;
  }
  if (pathname.startsWith('/freelancer-dashboard') && role !== 'FREELANCER') {
    return <Navigate to="/client-dashboard" replace />;
  }

  if (allowedRole && role !== allowedRole) {
    const redirectTarget = role === 'CLIENT' ? '/client-dashboard' : '/freelancer-dashboard';
    return <Navigate to={redirectTarget} replace />;
  }
  return children;
};

export default ProtectedRoute;
