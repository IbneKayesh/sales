import { useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiUser, FiPackage, FiX, FiUsers, FiBox, FiFileText, FiShoppingCart, FiDollarSign, FiStore } from "react-icons/fi";

const drawerItems = [
  { path: "/", icon: FiHome, label: "Home" },
  { path: "/auth/login", icon: FiUser, label: "Profile" },
  { path: "/shopping", icon: FiShoppingCart, label: "Shopping" },
  { path: "/cart", icon: FiShoppingCart, label: "Cart" },
  { path: "/order", icon: FiPackage, label: "Orders" },
  { path: "/shop", icon: FiStore, label: "Shops" },
  { path: "/customers", icon: FiUsers, label: "Customers" },
  { path: "/products", icon: FiBox, label: "Products" },
  { path: "/invoice", icon: FiFileText, label: "Invoices" },
  { path: "/invoice-collections", icon: FiDollarSign, label: "Collections" },
];

export default function LeftFlyout({ open, onClose }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleNav = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {open && <div className="drawer-overlay" onClick={onClose} />}

      <aside className={`drawer-panel${open ? " drawer-panel--open" : ""}`}>
        <div className="drawer-header">
          <h2 className="drawer-title">Menu</h2>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close menu">
            <FiX />
          </button>
        </div>

        <div className="drawer-body">
          <nav>
            <ul className="drawer-list">
              {drawerItems.map(({ path, icon: Icon, label }) => {
                const isActive = pathname === path;
                return (
                <li key={label}>
                  <button className={`drawer-link${isActive ? " drawer-link--active" : ""}`} onClick={() => handleNav(path)}>
                    <Icon />
                    {label}
                  </button>
                </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
