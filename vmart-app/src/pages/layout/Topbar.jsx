import { FiShoppingCart, FiLogOut, FiUsers, FiShoppingBag } from "react-icons/fi";
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
    <header className="topbar">
      <button onClick={onMenu}>☰</button>

      <h3>Demo App</h3>

      <button onClick={logout}><FiLogOut/></button>
    </header>
  );
}