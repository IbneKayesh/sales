import React from "react";
import { useAuth } from "@/context/AuthContext";
import CustomerHome from "./customer/CustomerHome";
import ShopHomePage from "./shop/ShopHomePage";

const HomePage = () => {
  const { user } = useAuth();

  if (user?.role === "CUSTOMER") {
    return <CustomerHome />;
  }

  if (user?.role === "SHOP") {
    return <ShopHomePage />;
  }

  return (
    <div className="page-container" style={{ textAlign: "center", padding: "40px 16px" }}>
      <div style={{ fontSize: "40px", marginBottom: "8px" }}>🏪</div>
      <h2>Welcome to Virtual Mart</h2>
      <p style={{ color: "var(--text-secondary)" }}>Please log in to continue</p>
    </div>
  );
};

export default HomePage;
