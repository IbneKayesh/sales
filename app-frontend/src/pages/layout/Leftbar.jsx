import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getStorageData, setStorageData } from "../../utils/storage";
import "./Leftbar.css";

const Leftbar = ({ menus }) => {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const data = getStorageData();
    setExpandedMenu(data.expandedMenu);
  }, []);

  const toggleMenu = (menuName) => {
    const newExpandedMenu = expandedMenu === menuName ? null : menuName;
    setExpandedMenu(newExpandedMenu);
    setStorageData({ expandedMenu: newExpandedMenu });
  };

  const handleMenuClick = (submenu) => {
    // Find the parent group and show all submenus of that group as navigation icons
    const currentMenu = menus.find(menu => menu.submenus.some(sub => sub.id === submenu.id));
    if (currentMenu) {
      const data = getStorageData();
      const currentGroup = data.currentGroup;
      if (currentGroup !== currentMenu.name) {
        const navigationIcons = currentMenu.submenus.map(sub => ({
          id: sub.id,
          name: sub.name,
          icon: sub.icon,
          url: sub.url
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
          <div key={menu.name} className={`group ${expandedMenu === menu.name ? 'expanded' : ''}`}>
            <div
              className="group-header"
              onClick={() => toggleMenu(menu.name)}
            >
              <i className={menu.icon}></i>
              {menu.name}
            </div>
            {expandedMenu === menu.name && (
              <div className="menu-list">
                {menu.submenus.map((submenu) => (
                  <div
                    key={submenu.id}
                    onClick={() => handleMenuClick(submenu)}
                    className={`menu-item ${location.pathname === submenu.url ? 'selected' : ''}`}
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
    </div>
  );
};

export default Leftbar;
