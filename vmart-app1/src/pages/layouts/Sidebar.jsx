import React from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Home, ShoppingCart, ClipboardList, Store, Receipt, Users, FileText } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useShop } from "@/context/ShopContext";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const role = user?.role;

  let dueCount = 0;
  let cartCount = 0;
  try {
    if (role === "SHOP") {
      const { dueInvoices } = useShop();
      dueCount = dueInvoices?.length || 0;
    } else {
      const { cartTotalItems } = useCart();
      cartCount = cartTotalItems || 0;
    }
  } catch(e) {}

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  };

  const navItem = (path, icon, label, badge = 0) => (
    <div
      onClick={() => { navigate(path); onClose(); }}
      className="sidebar-nav-item"
    >
      <div className="sidebar-nav-item-inner">
        <span className="sidebar-nav-icon">{icon}</span>
        {label}
      </div>
      {badge > 0 && (
        <span className="sidebar-nav-badge">{badge}</span>
      )}
    </div>
  );

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div onClick={onClose} className="sidebar-backdrop" />
      )}

      {/* Sidebar panel */}
      <div
        className="lite-sidebar"
        style={{
          position: "absolute",
          height: "100%",
          top: 0,
          width: "75vw",
          maxWidth: "300px",
          left: isOpen ? 0 : "-300px"
        }}
      >
        <div className="sidebar-header">
          <div className="sidebar-header-icon">🏪</div>
          <h2 className="sidebar-header-title">Virtual Mart</h2>
          <div className="sidebar-header-role">{role === "SHOP" ? "Shop Owner" : "Customer"}</div>
        </div>

        <div className="lite-sidebar-content sidebar-content">
          {role === "SHOP" ? (
            <>
              {navItem("/", <Home size={20} />, "Dashboard")}
              {navItem("/shop/products", <Store size={20} />, "Products")}
              {navItem("/invoice/list", <FileText size={20} />, "Invoices")}
              {navItem("/shop/due-collections", <Receipt size={20} />, "Due Collections", dueCount)}
              {navItem("/shop/customers", <Users size={20} />, "Customers")}
            </>
          ) : (
            <>
              {navItem("/", <Store size={20} />, "Shop Products")}
              {navItem("/customer/cart", <ShoppingCart size={20} />, "My Cart", cartCount)}
              {navItem("/customer/orders", <ClipboardList size={20} />, "My Orders")}
              {navItem("/customer/invoices", <FileText size={20} />, "My Invoices")}
              {navItem("/customer/shops", <Store size={20} />, "All Shops")}
            </>
          )}

          <div className="sidebar-divider" />
          {navItem("/profile", <User size={20} />, "My Profile")}
        </div>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="sidebar-logout-btn">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
