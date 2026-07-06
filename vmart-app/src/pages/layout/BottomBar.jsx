import { useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiShoppingCart, FiPackage, FiStore, FiUser } from "react-icons/fi";

const navItems = [
  { path: "/", icon: FiHome, label: "Home" },
  { path: "/shopping", icon: FiShoppingCart, label: "Shop" },
  { path: "/cart", icon: FiShoppingCart, label: "Cart" },
  { path: "/order", icon: FiPackage, label: "Orders" },
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
