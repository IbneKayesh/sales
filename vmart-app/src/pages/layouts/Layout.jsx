import React, { useState } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import BottomBar from "./BottomBar";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { useAuth } from "@/context/AuthContext";

const BOTTOM_NAV_PATHS = {
  CUSTOMER: ["/", "/customer/cart", "/customer/orders", "/customer/shops", "/profile"],
  SHOP:     ["/", "/invoice/list", "/shop/due-collections", "/shop/customers", "/profile"],
};

const Layout = () => {
  const location  = useLocation();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthPage  = location.pathname === "/login";
  const isPrintPage = location.pathname.includes("/invoice/print/");

  // Redirect unauthenticated users to login
  if (!loading && !user && !isAuthPage) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role;
  const navPaths = role ? (BOTTOM_NAV_PATHS[role] || BOTTOM_NAV_PATHS.CUSTOMER) : [];
  const showBottomNav = navPaths.includes(location.pathname);

  return (
    <>
      {!isAuthPage && !isPrintPage && (
        <>
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
      )}
      <Outlet />
      {showBottomNav && !isAuthPage && <BottomBar />}
    </>
  );
};

export default Layout;
