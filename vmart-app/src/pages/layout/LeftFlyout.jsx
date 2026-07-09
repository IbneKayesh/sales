import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiHome,
  FiUser,
  FiPackage,
  FiX,
  FiUsers,
  FiBox,
  FiFileText,
  FiShoppingCart,
  FiDollarSign,
  FiGrid,
  FiHeart,
  FiShoppingBag,
  FiLogOut,
} from "react-icons/fi";
import "./LeftFlyout.css";

const customerItems = [
  { path: "/", icon: FiHome, label: "Home" },
  { path: "/shopping", icon: FiGrid, label: "Shop" },
  { path: "/cart", icon: FiShoppingCart, label: "Cart" },
  { path: "/order", icon: FiPackage, label: "My Orders" },
  { path: "/invoice", icon: FiFileText, label: "My Invoices" },
  { path: "/favorites", icon: FiHeart, label: "Favorites" },
];

const shopItems = [
  { path: "/", icon: FiHome, label: "Home" },
  { path: "/shop", icon: FiShoppingBag, label: "My Shop" },
  { path: "/products", icon: FiBox, label: "Products" },
  { path: "/order", icon: FiPackage, label: "Orders" },
  { path: "/customers", icon: FiUsers, label: "Customers" },
  { path: "/invoice", icon: FiFileText, label: "Invoices" },
  { path: "/invoice-collections", icon: FiDollarSign, label: "Collections" },
];

export default function LeftFlyout({ open, onClose }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { role, logout } = useAuth();

  const navItems =
    role === "CUSTOMER"
      ? customerItems
      : role === "SHOP"
        ? shopItems
        : customerItems;

  const profilePath =
    role === "CUSTOMER"
      ? "/customer-profile"
      : role === "SHOP"
        ? "/shop-profile"
        : "/auth/login";

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  const sectionLabel =
    role === "SHOP"
      ? "Shop Management"
      : role === "CUSTOMER"
        ? "Shopping"
        : Menu;

  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose} />}
      <aside className={`drawer-panel${open ? " drawer-panel--open" : ""}`}>
        <div className="drawer-header">
          <h2 className="drawer-title">vMart 1.0.0</h2>
          <button
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            <FiX />
          </button>
        </div>

        <div className="drawer-body">
          <nav>
            <div className="drawer-section-label">{sectionLabel}</div>
            <ul className="drawer-list">
              {navItems.map(({ path, icon: Icon, label }) => {
                const isActive = pathname === path;
                return (
                  <li key={label}>
                    <button
                      className={`drawer-link${isActive ? " drawer-link--active" : ""}`}
                      onClick={() => handleNav(path)}
                    >
                      <Icon />
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="drawer-section-label">Account</div>
            <ul className="drawer-list">
              <li>
                <button
                  className={`drawer-link${pathname === profilePath ? " drawer-link--active" : ""}`}
                  onClick={() => handleNav(profilePath)}
                >
                  <FiUser />
                  Profile
                </button>
              </li>

              <li>
                <button
                  className={`drawer-link`}
                  style={{ fontWeight: 700, color: "red"}}
                  onClick={logout}
                >
                  <FiLogOut />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
