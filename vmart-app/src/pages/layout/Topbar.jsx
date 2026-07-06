import { FiLogOut, FiMenu } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Topbar({ onMenu }) {
    const {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    logout,
    setUser,
    setLoading,
  } = useAuth();

  return (
    <header className="app-header">
      <button className="ui-btn-icon" onClick={onMenu}><FiMenu /></button>

      <h2 className="app-logo-title">Demo App</h2>

      <button className="ui-btn-icon" onClick={logout}><FiLogOut/></button>
    </header>
  );
}