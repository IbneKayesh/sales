import React from "react";
import { Menu, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import "./Topbar.css";

const Topbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isShop = user?.role === "SHOP";

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <button className="lite-icon-btn" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <span className="topbar-brand">Virtual Mart</span>
      </div>

      <div className="top-bar-right">
        {isShop && (
          <button className="lite-icon-btn" onClick={() => navigate("/invoice/list")}>
            <Bell size={20} />
            <div className="lite-badge"></div>
          </button>
        )}
        <button className="lite-icon-btn" onClick={() => navigate("/profile")}>
          <div className="topbar-avatar">
            {(user?.name || "U").charAt(0).toUpperCase()}
          </div>
        </button>
      </div>
    </div>
  );
};

export default Topbar;
