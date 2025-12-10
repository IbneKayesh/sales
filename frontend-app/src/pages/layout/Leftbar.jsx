import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getStorageData, setStorageData } from "../../utils/storage";
import "./Leftbar.css";

const Leftbar = ({ menus }) => {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const data = getStorageData();
    setExpandedMenu(data.expandedMenu);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleMenu = (menuName) => {
    const newExpandedMenu = expandedMenu === menuName ? null : menuName;
    setExpandedMenu(newExpandedMenu);
    setStorageData({ expandedMenu: newExpandedMenu });
  };

  const handleMenuClick = (submenu) => {
    // Find the parent group and show all submenus of that group as navigation icons
    const currentMenu = menus.find((menu) =>
      menu.submenus.some((sub) => sub.id === submenu.id)
    );
    if (currentMenu) {
      const data = getStorageData();
      const currentGroup = data.currentGroup;
      if (currentGroup !== currentMenu.name) {
        const navigationIcons = currentMenu.submenus.map((sub) => ({
          id: sub.id,
          name: sub.name,
          icon: sub.icon,
          url: sub.url,
        }));
        setStorageData({ navigationIcons, currentGroup: currentMenu.name });
      }
    }
    navigate(submenu.url);
  };

  return (
    <div className="leftbar">
      <div className="groups-container">
        {menus.map((menu) => (
          <div
            key={menu.name}
            className={`group ${expandedMenu === menu.name ? "expanded" : ""}`}
          >
            <div className="group-header" onClick={() => toggleMenu(menu.name)}>
              <i className={menu.icon}></i>
              {menu.name}
            </div>
            {expandedMenu === menu.name && (
              <div className="menu-list">
                {menu.submenus.map((submenu) => (
                  <div
                    key={submenu.id}
                    onClick={() => handleMenuClick(submenu)}
                    className={`menu-item ${
                      location.pathname === submenu.url ? "selected" : ""
                    }`}
                  >
                    <i className={submenu.icon}></i>
                    <div className="menu-name">{submenu.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer Section */}
      <div className="leftbar-footer">
        {/* Clock and Date */}
        <div className="footer-clock-section">
          <div className="footer-clock-time">
            {currentTime.toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </div>
          <div className="footer-clock-date">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Developer Info */}
        <div className="footer-developer-info">
          <div>
            <strong>Edition:</strong> Standard
          </div>
          <div>
            <strong>Version:</strong> 1.0.0
          </div>
          <div>
            <strong>Release:</strong> 01-JAN-2026
          </div>
          <div>
            <strong>Developed by:</strong> SGD
          </div>
          <div className="footer-copyright">© 2025 All Rights Reserved</div>
        </div>
      </div>
    </div>
  );
};

export default Leftbar;
