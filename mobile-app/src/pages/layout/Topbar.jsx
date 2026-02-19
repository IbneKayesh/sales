import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { getStorageData } from "@/utils/storage";
import "./Topbar.css";
import ActiveBusiness from "@/components/ActiveBusiness";
import UserProfile from "@/components/UserProfile";


const Topbar = ({
  leftbarCollapsed,
  onToggleLeftbar,
  onToggleFullMode,
  menus,
}) => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [navigationIcons, setNavigationIcons] = useState([]);

  useEffect(() => {
    const data = getStorageData();
    setNavigationIcons(data.navigationIcons || []);
  }, [location.pathname]); // Update when route changes

  const handleLogout = () => {
    logout();
  };

  // Find the selected menu item based on current path
  const getSelectedMenuName = () => {
    for (const menu of menus) {
      for (const submenu of menu.submenus) {
        if (submenu.url === location.pathname) {
          return submenu.name;
        }
      }
    }
    return "Home";
  };

  const selectedMenuName = getSelectedMenuName();

  const [showActiveBusiness, setShowActiveBusiness] = useState(false);

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <button className="topbar-btn collapse-btn" onClick={onToggleLeftbar}>
            <i
              className={`pi ${
                leftbarCollapsed ? "pi-angle-right" : "pi-angle-left"
              }`}
            ></i>
          </button>
          <button
            className="topbar-btn full-mode-btn"
            onClick={onToggleFullMode}
          >
            <i className="pi pi-expand"></i>
          </button>
        </div>
        <div className="topbar-center">
          {navigationIcons.length > 0 ? (
            <div className="navigation-icons">
              {navigationIcons.map((icon) => (
                <button
                  key={icon.id}
                  className="topbar-btn nav-icon-btn mr-1"
                  onClick={() => navigate(icon.url)}
                  title={icon.name}
                >
                  <i className={icon.icon}></i>
                </button>
              ))}
            </div>
          ) : (
            `${selectedMenuName} - SGD`
          )}
        </div>
        <div className="topbar-avatar">
          <div className="flex items-center gap-2">
            <button className="topbar-btn hidden">
              <i className="pi pi-bell"></i>
            </button>
            <UserProfile
              onSwitchBusiness={() => setShowActiveBusiness(true)}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>
      {showActiveBusiness && (
        <ActiveBusiness
          visible={showActiveBusiness}
          setVisible={setShowActiveBusiness}
        />
      )}
    </>
  );
};

export default Topbar;
