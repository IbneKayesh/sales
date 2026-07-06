import { useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiSearch, FiPlus, FiHeart, FiUser } from "react-icons/fi";

const navItems = [
  { path: "/", icon: FiHome, label: "Home" },
  { path: "/shop", icon: FiSearch, label: "Search" },
  { path: "/shopping", icon: FiPlus, label: "Cart" },
  { path: "/favorites", icon: FiHeart, label: "Favorites" },
  { path: "/auth/login", icon: FiUser, label: "Profile" },
];

export default function BottomBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="nav-bar">
      {navItems.map(({ path, icon: Icon, label }) => {
        const isActive = pathname === path;

        return (
          <button
            key={label}
            className={`nav-item${isActive ? " nav-item--active" : ""}`}
            aria-label={label}
            onClick={() => navigate(path)}
          >
            <Icon className="nav-item-icon" />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}