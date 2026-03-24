import { Navigate } from 'react-router-dom';

// Optional alias page for legacy /dashboard route. Redirect based on user role.
const DashboardPage = () => {
  const role = localStorage.getItem('role');
  if (role === 'CLIENT') {
    return <Navigate to="/client-dashboard" replace />;
  }
  if (role === 'FREELANCER') {
    return <Navigate to="/freelancer-dashboard" replace />;
  }
  return <Navigate to="/login" replace />;
};

export default DashboardPage;
