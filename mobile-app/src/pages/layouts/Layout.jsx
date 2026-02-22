import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import BottomBar from "./BottomBar";
import Topbar from "./Topbar";

const Layout = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login";
  const isPrintPage = location.pathname.includes("/invoice/print/");

  // Show BottomNav only on specific primary pages
  const showBottomNav = ["/", "/modules", "/profile", "/settings"].includes(
    location.pathname,
  );

  return (
    <>
      {/* {!isAuthPage && !isPrintPage && <TopNav />} */}
      {!isAuthPage && !isPrintPage && <Topbar />}
      <Outlet />
      {showBottomNav && <BottomBar />}
    </>
  );
};

export default Layout;
