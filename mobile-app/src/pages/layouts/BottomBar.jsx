import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Settings, User, LayoutGrid } from "lucide-react";

const BottomBar = () => {
  return (
    <nav className="bottom-bar">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
      >
        <Home size={22} />
        <span>Dashboard</span>
      </NavLink>
      <NavLink
        to="/modules"
        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
      >
        <LayoutGrid size={22} />
        <span>Modules</span>
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
      >
        <User size={22} />
        <span>Profile</span>
      </NavLink>
      <NavLink
        to="/settings"
        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
      >
        <Settings size={22} />
        <span>Settings</span>
      </NavLink>
    </nav>
  );
};

export default BottomBar;
