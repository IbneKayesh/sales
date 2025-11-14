import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { getStorageData } from "../../utils/storage";
import "./FloatingMenu.css";

const FloatingMenu = ({ onShowTopBar, onShowLeftBar, menus, leftbarCollapsed }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [navigationIcons, setNavigationIcons] = useState([]);

  useEffect(() => {
    const data = getStorageData();
    setNavigationIcons(data.navigationIcons || []);
  }, []); // Keep as is since menu is static

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const menuItems = [
    ...navigationIcons.map((icon) => ({
      label: icon.name,
      icon: icon.icon,
      command: () => navigate(icon.url),
    })),
    {
      separator: navigationIcons.length > 0,
    },
    {
      label: "Show Top Bar",
      icon: "pi pi-eye",
      command: onShowTopBar,
    },
    {
      label: leftbarCollapsed ? "Show Left Bar" : "Hide Left Bar",
      icon: leftbarCollapsed ? "pi pi-bars" : "pi pi-times",
      command: onShowLeftBar,
    },
    {
      label: "Profile",
      icon: "pi pi-user",
      template: () => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px' }}>
          <img
            src={`https://ui-avatars.com/api/?name=${user?.username}&background=667eea&color=fff`}
            alt="Avatar"
            style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgba(255, 255, 255, 0.3)' }}
          />
          <span className="text-white">{user?.username}</span>
        </div>
      ),
    },
    {
      separator: true,
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: handleLogout,
    },
  ];

  const toggleMenu = (event) => {
    menuRef.current.toggle(event);
  };

  return (
    <div className="floating-menu-container">
      <Button
        icon="pi pi-bars"
        className="floating-menu-btn"
        onClick={toggleMenu}
        tooltip="Menu"
        tooltipOptions={{ position: 'right' }}
      />
      <Menu
        model={menuItems}
        popup
        ref={menuRef}
        className="floating-menu"
      />
    </div>
  );
};

export default FloatingMenu;
