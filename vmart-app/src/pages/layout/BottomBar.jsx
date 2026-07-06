import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiShoppingCart, FiPackage, FiGrid, FiUser, FiFileText } from "react-icons/fi";
import { useAuth, ROLES } from "../context/AuthContext";
import { load, KEYS } from "../../utils/storage";

const customerNav = [
  { path: "/", icon: FiHome, label: "Home" },
  { path: "/shopping", icon: FiGrid, label: "Shop" },
  { path: "/cart", icon: FiShoppingCart, label: "Cart" },
  { path: "/order", icon: FiPackage, label: "Orders" },
  { path: "/customer-profile", icon: FiUser, label: "Profile" },
];

const shopNav = [
  { path: "/", icon: FiHome, label: "Home" },
  { path: "/products", icon: FiGrid, label: "Products" },
  { path: "/order", icon: FiPackage, label: "Orders" },
  { path: "/invoice", icon: FiFileText, label: "Invoices" },
  { path: "/shop-profile", icon: FiUser, label: "Profile" },
];

export default function BottomBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isCustomer, isShop } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  /* Keep cart count updated on every render */
  useEffect(() => {
    const updateCartCount = () => {
      const cart = load(KEYS.CART);
      setCartCount(cart.reduce((s, p) => s + p.qty, 0));
    };
    updateCartCount();

    /* Listen for storage changes (cross-tab) */
    const handleStorage = (e) => {
      if (e.key === KEYS.CART) updateCartCount();
    };
    window.addEventListener("storage", handleStorage);

    /* Poll for same-tab updates */
    const interval = setInterval(updateCartCount, 2000);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const navItems = isCustomer ? customerNav : isShop ? shopNav : customerNav;

  return (
    <nav className="nav-bar">
      {navItems.map(({ path, icon: Icon, label }) => {
        const isActive = pathname === path;
        const isCartTab = label === "Cart";

        return (
          <button
            key={label}
            className={`nav-item${isActive ? " nav-item--active" : ""}`}
            aria-label={label}
            onClick={() => navigate(path)}
          >
            <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
              <Icon className="nav-item-icon" />
              {isCartTab && cartCount > 0 && (
                <span style={{
                  position: "absolute", top: -6, right: -8,
                  background: "var(--error)", color: "#fff",
                  fontSize: "0.55rem", fontWeight: 700,
                  minWidth: 16, height: 16, borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  padding: "0 3px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  animation: "fade-in 0.2s ease",
                }}>
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </div>
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
