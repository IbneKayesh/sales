import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { getStorageData, setStorageData } from "@/utils/storage";
import { useAuth } from "@/hooks/useAuth.jsx";
import "./Sidebar.css";

const Sidebar = ({ collapsed }) => {
  const [expandedMenus, setExpandedMenus] = useState([]);
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

  const buildMenuTree = useCallback((menus) => {
    if (!menus) return [];
    const map = {};
    const tree = [];

    // Initialize map with normalized items
    menus.forEach((menu) => {
      map[menu.id] = {
        ...menu,
        label: menu.menus_mname || menu.label,
        link: menu.menus_mlink === "NA" ? null : menu.menus_mlink || menu.link,
        icon:
          menu.menus_micon === "default" || !menu.menus_micon
            ? "pi-circle-fill"
            : menu.menus_micon,
        notes: menu.menus_notes,
        subItems: [],
      };
    });

    // Build tree
    menus.forEach((menu) => {
      const parentId = menu.menus_menus;
      if (parentId && parentId !== "NA") {
        if (map[parentId]) {
          map[parentId].subItems.push(map[menu.id]);
        } else {
          // If parent not found in map, it's a root item
          tree.push(map[menu.id]);
        }
      } else {
        tree.push(map[menu.id]);
      }
    });

    return tree;
  }, []);

  const sortedMenus = useMemo(() => {
    const tree = buildMenuTree(userMenus);

    if (recentLinks.length > 0) {
      tree.unshift({
        id: -99,
        label: "Recent",
        icon: "pi-history",
        subItems: recentLinks.map((r) => ({
          ...r,
          menus_mlink: r.link,
          menus_mname: r.label,
        })),
      });
    }

    return tree;
  }, [userMenus, recentLinks, buildMenuTree]);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return null;

    const term = searchTerm.toLowerCase();
    const results = [];

    const flatten = (items) => {
      items.forEach((item) => {
        // Skip the Recent section entirely
        if (item.id === -99) return;

        if (
          item.label?.toLowerCase().includes(term) ||
          item.link?.toLowerCase().includes(term) ||
          item.notes?.toLowerCase().includes(term) ||
          item.menus_mlink?.toLowerCase().includes(term)
        ) {
          if (item.link || (item.menus_mlink && item.menus_mlink !== "NA")) {
            results.push({
              ...item,
              id: `search-${item.id}`,
              originalId: item.id,
            });
          }
        }
        if (item.subItems) {
          flatten(item.subItems);
        }
      });
    };

    flatten(sortedMenus);
    return results;
  }, [sortedMenus, searchTerm]);

  useEffect(() => {
    // Don't collapse menus while the user is actively searching;
    // when search is cleared this runs again and resets to current route.
    if (searchTerm.trim()) return;

    const findAncestors = (items, targetPath, ancestors = []) => {
      for (const item of items) {
        const itemLink = item.link || item.menus_mlink;
        if (itemLink && itemLink !== "NA" && itemLink === targetPath) {
          return ancestors;
        }
        if (item.subItems && item.subItems.length > 0) {
          const found = findAncestors(item.subItems, targetPath, [
            ...ancestors,
            item.id,
          ]);
          if (found) return found;
        }
      }
      return null;
    };

    const ancestors = findAncestors(sortedMenus, location.pathname);
    if (ancestors) {
      setExpandedMenus(ancestors);
    }
  }, [location.pathname, sortedMenus, searchTerm]);

  useEffect(() => {
    const data = getStorageData();
    setUserData(data.users);
    //console.log("data", data.menus);
    setUserMenus(data.menus);

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
      setExpandedMenus((prev) =>
        prev.includes(menuId)
          ? prev.filter((id) => id !== menuId)
          : [...prev, menuId],
      );
    },
    [collapsed],
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isChildActive = useCallback(
    (items) => {
      if (!items) return false;
      return items.some((item) => {
        if (item.link && location.pathname === item.link) return true;
        if (item.menus_mlink && location.pathname === item.menus_mlink)
          return true;
        if (item.subItems && item.subItems.length > 0) {
          return isChildActive(item.subItems);
        }
        return false;
      });
    },
    [location.pathname],
  );

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
            <span className="logo-text title-gradient">EAAC</span>
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
                    to={item.link || item.menus_mlink}
                    className="flex align-items-center w-full"
                    style={{ textDecoration: "none", color: "inherit" }}
                    onClick={() => handleLinkClick(item)}
                  >
                    <i
                      className={`icon pi pi-circle-fill mr-2`}
                      aria-hidden="true"
                    ></i>
                    {!collapsed && (
                      <span className="label">
                        {item.label || item.menus_mname}
                      </span>
                    )}
                  </Link>
                </div>
              ))
            : sortedMenus.map((menu) => {
                const renderMenu = (item, level = 0) => {
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isExpanded = expandedMenus.includes(item.id);
                  const hasActiveChild =
                    hasSubItems && isChildActive(item.subItems);
                  const isActive =
                    (item.link || item.menus_mlink) &&
                    location.pathname === (item.link || item.menus_mlink);

                  const isLink = item.menus_mlink && item.menus_mlink !== "NA";

                  if (isLink && !hasSubItems) {
                    return (
                      <Link
                        key={item.id}
                        to={item.link || item.menus_mlink}
                        className={`sub-item ${isActive ? "active" : ""}`}
                        role="menuitem"
                        onClick={() => handleLinkClick(item)}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <i
                          className={`pi ${level === 0 ? "pi-apps" : "pi-circle-fill sub-icon-dot"}`}
                          aria-hidden="true"
                        ></i>
                        <span className="label">
                          {item.id === -99 ? (
                            <>
                              {item.label} ({item.count || 1})
                            </>
                          ) : (
                            item.label
                          )}
                        </span>
                      </Link>
                    );
                  }

                  return (
                    <div key={item.id} className="menu-group">
                      <div
                        className={`menu-item ${isExpanded || hasActiveChild ? "expanded" : ""} ${hasActiveChild || isActive ? "active" : ""}`}
                        role="button"
                        tabIndex={0}
                        aria-expanded={isExpanded}
                        onClick={() => toggleMenu(item.id)}
                        onKeyDown={(e) =>
                          handleMenuKeyDown(e, item.id, item.label)
                        }
                        title={collapsed ? item.label : ""}
                      >
                        <i
                          className={`icon pi ${item.icon || "pi-apps"}`}
                          aria-hidden="true"
                        ></i>
                        {!collapsed && (
                          <span className="label">{item.label}</span>
                        )}
                        {!collapsed && hasSubItems && (
                          <i
                            className="chevron pi pi-chevron-right"
                            aria-hidden="true"
                          ></i>
                        )}
                      </div>
                      {!collapsed && hasSubItems && (
                        <div className="sub-menu" role="menu">
                          {item.subItems.map((sub) =>
                            renderMenu(sub, level + 1),
                          )}
                        </div>
                      )}
                    </div>
                  );
                };

                return renderMenu(menu);
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
          {/* {JSON.stringify(userData)} */}
          <div className="user-info-inline">
            <div
              className="avatar-xs"
              aria-label={`User: ${userData?.users_uname || "User"}`}
            >
              {userData?.users_uname?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="user-details">
              <span
                className="user-name-text"
                aria-label={`User name: ${userData?.users_uname || "User"}`}
              >
                {userData?.users_uname || "User"}
              </span>
              <span className="user-role-text">
                {userData?.urole_rname || "User"}
              </span>
            </div>
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
