import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home, ShoppingCart, ClipboardList, Store, User,
  FileText, Receipt, Users, LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const BottomBar = () => {
  const { user } = useAuth();
  const role = user?.role;

  if (role === "SHOP") {
    return (
      <nav className="bottom-bar">
        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <LayoutDashboard size={22} />
          <span>Orders</span>
        </NavLink>
        <NavLink to="/invoice/list" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <FileText size={22} />
          <span>Invoices</span>
        </NavLink>
        <NavLink to="/shop/due-collections" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <Receipt size={22} />
          <span>Dues</span>
        </NavLink>
        <NavLink to="/shop/customers" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <Users size={22} />
          <span>Customers</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
          <User size={22} />
          <span>Profile</span>
        </NavLink>
      </nav>
    );
  }

  // CUSTOMER (default)
  return (
    <nav className="bottom-bar">
      <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
        <Home size={22} />
        <span>Shop</span>
      </NavLink>
      <NavLink to="/customer/cart" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
        <ShoppingCart size={22} />
        <span>Cart</span>
      </NavLink>
      <NavLink to="/customer/orders" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
        <ClipboardList size={22} />
        <span>Orders</span>
      </NavLink>
      <NavLink to="/customer/shops" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
        <Store size={22} />
        <span>Shops</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
        <User size={22} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomBar;
