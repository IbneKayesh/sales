import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, ROLES } from "../context/AuthContext";
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

const accountItems = []; /* path set dynamically below */

export default function LeftFlyout({ open, onClose }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isCustomer, isShop } = useAuth();

  const navItems = isCustomer
    ? customerItems
    : isShop
      ? shopItems
      : customerItems;
  const profilePath = isCustomer
    ? "/customer-profile"
    : isShop
      ? "/shop-profile"
      : "/auth/login";

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  const sectionLabel = isCustomer
    ? "Shopping"
    : isShop
      ? "Shop Management"
      : "Menu";

  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose} />}

      <aside className={`drawer-panel${open ? " drawer-panel--open" : ""}`}>
        <div className="drawer-header">
          <h2 className="drawer-title">Menu</h2>
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
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
