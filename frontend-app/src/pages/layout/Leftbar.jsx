import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getStorageData, setStorageData } from "@/utils/storage";
import "./Leftbar.css";

const Leftbar = ({ menus }) => {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);

  useEffect(() => {
    const data = getStorageData();
    setExpandedMenu(data.expandedMenu);
    setUser(data.user);
    setBusiness(data.business);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleMenu = (menus_gname) => {
    const newExpandedMenu = expandedMenu === menus_gname ? null : menus_gname;
    setExpandedMenu(newExpandedMenu);
    setStorageData({ expandedMenu: newExpandedMenu });
  };

  const handleMenuClick = (submenu) => {
    // Find the parent group and show all submenus of that group as navigation icons
    const currentMenu = menus.find((menu) =>
      menu.submenus.some((sub) => sub.id === submenu.id),
    );
    if (currentMenu) {
      const data = getStorageData();
      const currentGroup = data.currentGroup;
      if (currentGroup !== currentMenu.menus_gname) {
        const navigationIcons = currentMenu.submenus.map((sub) => ({
          id: sub.id,
          name: sub.menus_mname,
          icon: sub.menus_micon,
          url: sub.menus_mlink,
        }));
        setStorageData({
          navigationIcons,
          currentGroup: currentMenu.menus_gname,
        });
      }
    }
    navigate(submenu.menus_mlink);
  };

  return (
    <div className="leftbar">
      <div className="groups-container">
        {menus.map((menu) => (
          <div
            key={menu.menus_gname}
            className={`group ${expandedMenu === menu.menus_gname ? "expanded" : ""}`}
          >
            <div
              className="group-header"
              onClick={() => toggleMenu(menu.menus_gname)}
            >
              <i className={menu.menus_gicon}></i>
              {menu.menus_gname}
            </div>
            {expandedMenu === menu.menus_gname && (
              <div className="menu-list">
                {menu.submenus.map((submenu) => (
                  <div
                    key={submenu.id}
                    onClick={() => handleMenuClick(submenu)}
                    className={`menu-item ${
                      location.pathname === submenu.menus_mlink
                        ? "selected"
                        : ""
                    }`}
                  >
                    <i className={submenu.menus_micon}></i>
                    <div className="menu-name">{submenu.menus_mname}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="menu-list">
          <div className="menu-item bg-gray-900" onClick={() => navigate("/home/module")}>
            <i className="pi pi-arrow-right"></i>
            <div className="menu-name text-gray-300">Goto Modules</div>
          </div>
        </div>
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
            <strong>Business:</strong>{" "}
            <span className="font-bold text-yellow-500">
              {business?.bsins_bname}
            </span>
          </div>
          <div>
            <strong>Logged:</strong>
            <span
              className={`mx-1 text-blue-500 font-bold pi pi-${
                user?.users_isrgs === 1 ? "crown " : "lightbulb"
              }`}
            ></span>
            {user?.users_oname}
          </div>
          <div>
            <strong>Reg No:</strong> {user?.users_regno}
          </div>
          <div>
            <strong>Grains:</strong>{" "}
            <span
              className={`font-bold ${
                Number(user?.users_nofcr || 0) > 0
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {Number(user?.users_nofcr || 0)}
            </span>
          </div>
          <div className="footer-copyright">
            © 2025-2026 All Rights Reserved. BA Pro
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leftbar;
