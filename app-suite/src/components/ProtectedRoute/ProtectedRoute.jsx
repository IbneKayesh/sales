
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { IconLock, IconHomeArrow, IconLogout } from '@/assets/icons';
import './ProtectedRoute.css';
const ProtectedRoute = () => {
  const { isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/home');
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (loading) {
    return (
      <div className="loadingScreen">
        <div className="spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="accessDenied">
        <div className="deniedCard">
          <div className="iconContainer">
            <IconLock className="lockIcon" />
          </div>
          <h1 className="deniedTitle">Access Denied</h1>
          <p className="deniedDescription">
            You need to be signed in to access this area. Please log in or return to the home page.
          </p>
          <div className="deniedActions">
            <button className="homeBtn" onClick={handleBackToHome}>
              <IconHomeArrow width="16" height="16" />
              Back to Home
            </button>
            <button className="logoutBtn" onClick={handleLogout}>
              <IconLogout width="16" height="16" />
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
