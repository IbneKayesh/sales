import React, { useEffect, useRef, useState } from "react";
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
  const [recentMenus, setRecentMenus] = useState([]);
  const [showRecent, setShowRecent] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const data = getStorageData();
    setRecentMenus(data.recentMenus || []);
  }, [location.pathname]); // Update when route changes

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowRecent(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const handleRecentClick = (url) => {
    setShowRecent(false);
    navigate(url);
  };

  const [showActiveBusiness, setShowActiveBusiness] = useState(false);

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <button className="topbar-btn" onClick={onToggleLeftbar}>
            <i
              className={`pi ${
                leftbarCollapsed ? "pi-angle-right" : "pi-angle-left"
              }`}
            ></i>
          </button>
          <button className="topbar-btn" onClick={onToggleFullMode}>
            <i className="pi pi-expand"></i>
          </button>
        </div>

        <div className="topbar-center">
          {recentMenus.length > 0 && (
            <div className="recent-menus-wrapper" ref={dropdownRef}>
              <button
                className="recent-menus-trigger topbar-btn"
                onClick={() => setShowRecent((v) => !v)}
                title="Recent menus"
              >
                <i className="pi pi-history"></i>
              </button>

              {showRecent && (
                <div className="recent-menus-dropdown">
                  <div className="recent-menus-header">Recent</div>
                  {recentMenus.map((menu) => (
                    <div
                      key={menu.url}
                      className={`recent-menu-item${
                        location.pathname === menu.url ? " active" : ""
                      }`}
                      onClick={() => handleRecentClick(menu.url)}
                    >
                      <i className={menu.icon}></i>
                      <span>{menu.name} ({menu.count || 1})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
