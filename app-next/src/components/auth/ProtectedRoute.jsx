import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, requiredPermission, fallbackPath = '/login' }) {
  const { isAuthenticated, canAccessRoute } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, preserving the intended destination
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role-based route access
  if (!canAccessRoute(location.pathname)) {
    return (
      <div className="access-denied">
        <div className="access-denied-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3>Access Denied</h3>
        <p>You don't have permission to access this page.</p>
        <p className="access-denied-hint">Contact your administrator to request access.</p>
      </div>
    );
  }

  return children;
}
