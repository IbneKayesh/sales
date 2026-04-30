import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { getStorageData, setStorageData } from "@/utils/storage";
import { useAuth } from "@/hooks/useAuth.jsx";
import "./Sidebar.css";

const Sidebar = ({ collapsed }) => {
  const [expandedMenu, setExpandedMenu] = useState(null);
  const [userMenus, setUserMenus] = useState([]);
  const [userData, setUserData] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [recentLinks, setRecentLinks] = useState([]);

  const handleLinkClick = useCallback((item) => {
    if (!item.link) return;

    setRecentLinks((prev) => {
      const existingIndex = prev.findIndex((r) => r.link === item.link);
      let updated;

      if (existingIndex > -1) {
        // Increment count and move to top
        const existing = prev[existingIndex];
        const updatedItem = {
          ...existing,
          count: (existing.count || 0) + 1,
        };

        updated = [updatedItem, ...prev.filter((_, i) => i !== existingIndex)];
      } else {
        // New item
        const newItem = {
          id: item.originalId || item.id,
          label: item.label,
          link: item.link,
          icon: item.icon || "pi-circle-fill",
          count: 1,
        };

        updated = [newItem, ...prev];
      }

      // Sort by count (descending)
      updated = updated.sort((a, b) => (b.count || 0) - (a.count || 0));

      // Keep only top 10
      updated = updated.slice(0, 10);

      setStorageData({ recent_links: updated });
      return updated;
    });
  }, []);

  const sortedMenus = useMemo(() => {
    const sortFn = (a, b) => a.id - b.id;

    const menusToProcess = [...userMenus];
    if (recentLinks.length > 0) {
      menusToProcess.push({
        id: -99,
        label: "Recent",
        icon: "pi-history",
        subItems: recentLinks,
      });
    }

    return menusToProcess
      .map((menu) => ({
        ...menu,
        subItems: menu.subItems ? [...menu.subItems].sort(sortFn) : null,
      }))
      .sort(sortFn);
  }, [userMenus, recentLinks]);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return null;

    const term = searchTerm.toLowerCase();
    const results = [];

    userMenus.forEach((menu) => {
      // Check sub-items label OR link
      if (menu.subItems) {
        menu.subItems.forEach((sub) => {
          if (
            sub.label?.toLowerCase().includes(term) ||
            sub.link?.toLowerCase().includes(term)
          ) {
            results.push({
              id: `sub-${sub.id}`,
              label: sub.label,
              link: sub.link,
              icon: sub.icon || menu.icon,
              isParent: false,
              originalId: sub.id,
            });
          }
        });
      }
    });

    return results.sort((a, b) => a.originalId - b.originalId);
  }, [userMenus, searchTerm]);

  useEffect(() => {
    const data = getStorageData();
    if (data?.users?.menu_list) {
      setUserMenus(data.users.menu_list);
      setUserData(data.users);
    }
    const savedRecent = data?.recent_links;
    if (savedRecent) {
      setRecentLinks(savedRecent);
    }

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleMenu = useCallback(
    (menuId) => {
      if (collapsed) return;
      setExpandedMenu((prev) => (prev === menuId ? null : menuId));
    },
    [collapsed],
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isChildActive = (subItems) => {
    return subItems.some((sub) => location.pathname === sub.link);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleMenuKeyDown = useCallback(
    (e, menuId, label) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleMenu(menuId);
      }
    },
    [toggleMenu],
  );

  return (
    <nav
      className={`sidebar ${collapsed ? "collapsed" : ""}`}
      role="navigation"
      aria-label="Main navigation"
    >
      {!collapsed && (
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <i className="pi pi-th-large" aria-hidden="true"></i>
            </div>
            <span className="logo-text">eGMT</span>
          </div>
        </div>
      )}

      <div className="groups-container">
        <div className="search-wrapper">
          <input
            className="p-inputtext-sm p-inputtext p-component search-input"
            placeholder="Search here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <i
              className="pi pi-times search-clear-icon"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            />
          )}
        </div>

        <nav className="menu-list" role="menubar">
          {searchTerm.trim()
            ? searchResults.map((item) => (
                <div key={item.id} className="menu-item">
                  <Link
                    to={item.link}
                    className="flex align-items-center w-full"
                    style={{ textDecoration: "none", color: "inherit" }}
                    onClick={() => handleLinkClick(item)}
                  >
                    <i
                      className={`icon pi pi-circle-fill mr-2`}
                      aria-hidden="true"
                    ></i>
                    {!collapsed && <span className="label">{item.label}</span>}
                  </Link>
                </div>
              ))
            : sortedMenus.map((menu) => {
                const isExpanded = expandedMenu === menu.id;
                const hasActiveChild =
                  menu.subItems && isChildActive(menu.subItems);
                const menuLabel = menu.label || "Menu";
                return (
                  <div key={menu.id} className="menu-group">
                    <div
                      className={`menu-item ${isExpanded || hasActiveChild ? "expanded" : ""} ${hasActiveChild ? "active" : ""}`}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExpanded}
                      aria-label={`Toggle ${menuLabel} ${menu.subItems ? "submenu" : ""}`}
                      onClick={() => toggleMenu(menu.id)}
                      onKeyDown={(e) =>
                        handleMenuKeyDown(e, menu.id, menuLabel)
                      }
                      title={collapsed ? menuLabel : ""}
                    >
                      <i
                        className={`icon pi pi-apps ${menu.icon || ""}`}
                        aria-hidden="true"
                      ></i>
                      {!collapsed && <span className="label">{menuLabel}</span>}
                      {!collapsed && menu.subItems && (
                        <i
                          className="chevron pi pi-chevron-right"
                          aria-hidden="true"
                        ></i>
                      )}
                    </div>
                    {!collapsed && menu.subItems && (
                      <div className="sub-menu" role="menu">
                        {menu.subItems.map((sub) => (
                          <Link
                            key={sub.id}
                            to={sub.link}
                            className={`sub-item ${location.pathname === sub.link ? "active" : ""}`}
                            role="menuitem"
                            onClick={() => handleLinkClick(sub)}
                            aria-current={
                              location.pathname === sub.link
                                ? "page"
                                : undefined
                            }
                          >
                            <i
                              className="pi pi-circle-fill sub-icon-dot"
                              aria-hidden="true"
                            ></i>
                            {menu.id === -99 ? (
                              <span className="flex align-items-center gap-1">
                                {sub.label} ({sub.count || 1})
                              </span>
                            ) : (
                              sub.label
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

          <div className="menu-item">
            <Link
              to="/sales-pos"
              onClick={() =>
                handleLinkClick({
                  id: "pos",
                  label: "POS",
                  link: "/sales-pos",
                  icon: "pi-shopping-cart",
                })
              }
              className="sub-item"
            >
              <i
                className="icon pi pi-shopping-cart mr-2"
                aria-hidden="true"
              ></i>
              <span className="label">POS</span>
            </Link>
          </div>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="footer-clock">
          <div className="time">{formatTime(currentTime)}</div>
          <div className="date">{formatDate(currentTime)}</div>
        </div>
        <div className="user-profile-mini">
          <div className="user-info-inline">
            <div
              className="avatar-xs"
              aria-label={`User: ${userData?.aempName || "User"}`}
            >
              {userData?.aempName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span
              className="user-name-text"
              aria-label={`User name: ${userData?.aempName || "User"}`}
            >
              {userData?.aempName || "User"}
            </span>
          </div>
          <button
            className="logout-btn-inline"
            onClick={handleLogout}
            title="Logout"
            aria-label="Log out"
          >
            <i className="pi pi-sign-out" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
