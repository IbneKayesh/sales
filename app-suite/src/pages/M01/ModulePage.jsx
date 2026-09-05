import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardBody,
} from "@/components/PageCard";
import Button from "@/components/Button";
import { useApp } from "@/context/AppContext";
import {
  IconHome,
  IconClose,
  IconDelete,
  IconPopup,
  IconChevronDown,
  IconSunrise,
  IconSun,
  IconSunset,
  IconMoon,
  IconStar,
} from "@/icons";
import { resolveMenuIcon } from "@/icons";
import { appModules, menus, toMenu } from "@/utils/appModules";
import { moduleShade } from "@/utils/theme";

const RECENT_STORAGE_KEY = "bsuite_recent_menus";
const MAX_RECENT = 20;

const modulePageSearchStyles = {
  wrap: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    width: "100%",
    maxWidth: 360,
  },
  input: {
    width: "100%",
    padding: "8px 32px 8px 12px",
    borderRadius: 8,
    border: "1px solid var(--border, #e0e0e0)",
    background: "var(--surface, #fff)",
    color: "var(--text, #111)",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  clear: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "none",
    cursor: "pointer",
    padding: 4,
    color: "var(--text-muted, #888)",
    fontSize: 14,
    lineHeight: 1,
  },
};

const popupListStyles = {
  wrap: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    position: "relative",
  },
  trigger: {
    position: "relative",
    width: 36,
    height: 36,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderRadius: 8,
    border: "1px solid var(--border, #e0e0e0)",
    background: "var(--surface, #fff)",
    color: "var(--text-muted, #888)",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    padding: "0 4px",
    borderRadius: 8,
    background: "var(--primary, #7c3aed)",
    color: "var(--primary-on, #fff)",
    fontSize: 10,
    fontWeight: 700,
    lineHeight: "16px",
    textAlign: "center",
  },
  panel: {
    position: "absolute",
    top: "calc(100% + 6px)",
    right: 0,
    zIndex: 60,
    minWidth: 280,
    maxWidth: 360,
    maxHeight: 320,
    overflowY: "auto",
    background: "var(--surface, #fff)",
    border: "1px solid var(--border, #e0e0e0)",
    borderRadius: "var(--radius-lg, 10px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.14)",
    padding: 8,
  },
  action: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 8px",
    fontSize: 11,
    borderRadius: 6,
    border: "1px solid var(--border, #e0e0e0)",
    background: "var(--surface, #fff)",
    color: "var(--text-muted, #888)",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    width: "100%",
    padding: "4px 4px 4px 8px",
    borderRadius: 8,
  },
  rowMain: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flex: 1,
    minWidth: 0,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    textAlign: "left",
    fontSize: 13,
    color: "var(--text-primary, #111)",
    padding: "2px 0",
  },
  rowAction: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: 26,
    height: 26,
    borderRadius: 6,
    border: "none",
    background: "transparent",
    color: "var(--text-muted, #888)",
    cursor: "pointer",
    padding: 0,
  },
};

// Rendered at module scope so its identity stays stable across re-renders
// (a component defined inside another component is remounted on every render,
// which would reset hover state and discard DOM).
const MenuCard = ({
  menu,
  onClick,
  onOpenPopup,
  pinned = false,
  onTogglePin = () => {},
  openMode = "both",
}) => {
  const [hovered, setHovered] = useState(false);
  // Theme preference: "link" opens only as the linked page, "window" opens
  // only as a floating window, "both" offers the page click plus the window
  // button.
  const canOpenLink = openMode === "link" || openMode === "both";
  const canOpenWindow = openMode === "window" || openMode === "both";
  // Module-tinted theme shade — each module keeps its own shade of the
  // current template color.
  const shade = moduleShade(menu.id);
  return (
    <div
      role="group"
      aria-label={menu.menus_mname}
      title={menu.menus_mname}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        padding: "4px 4px 4px 8px",
        border: `1px solid ${
          hovered
            ? `color-mix(in srgb, ${shade} 42%, transparent)`
            : "var(--border)"
        }`,
        borderRadius: "var(--radius-xl)",
        background: hovered
          ? `color-mix(in srgb, ${shade} 10%, transparent)`
          : "var(--surface)",
        fontFamily: "var(--font-sans)",
        boxSizing: "border-box",
        transition: "all 0.15s ease",
        width: "auto",
        flex: "0 1 auto",
        boxShadow: hovered
          ? `0 4px 12px color-mix(in srgb, ${shade} 20%, transparent)`
          : "none",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      <button
        type="button"
        onClick={() => {
          // "Link" (or "Both") follows the menu's page link; "Window"-only
          // makes the card click open the floating window instead.
          if (canOpenLink) onClick(menu);
          else onOpenPopup(menu);
        }}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          flex: 1,
          minWidth: 0,
          background: "transparent",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
          textAlign: "left",
          outline: "none",
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: "var(--radius-md)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            background: `color-mix(in srgb, ${shade} 10%, transparent)`,
            color: shade,
            fontSize: 16,
          }}
        >
          {menu.menus_micon}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-primary)",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
            }}
          >
            {menu.menus_mname}
          </span>
          <span
            style={{
              fontSize: "var(--fs-xs)",
              color: "var(--text-muted)",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {menu.menus_mdesc}
          </span>
        </div>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onTogglePin(menu);
        }}
        title={pinned ? `Unpin ${menu.menus_mname}` : `Pin ${menu.menus_mname}`}
        aria-label={pinned ? `Unpin ${menu.menus_mname}` : `Pin ${menu.menus_mname}`}
        aria-pressed={pinned}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          width: 26,
          height: 26,
          padding: 0,
          borderRadius: 6,
          border: "none",
          background: "transparent",
          color: pinned ? "var(--primary)" : "var(--text-muted)",
          cursor: "pointer",
        }}
      >
        <IconStar size={16} fill={pinned ? "currentColor" : "none"} />
      </button>
      {canOpenWindow && (
        <Button
          variant="ghost"
          size="sm"
          icon={<IconPopup size={16} />}
          onClick={(e) => {
            e.stopPropagation();
            onOpenPopup(menu);
          }}
          title={`Open ${menu.menus_mname} in window`}
          aria-label={`Open ${menu.menus_mname} in window`}
        />
      )}
    </div>
  );
};

// Module card with a focus effect: hovering the module name/header highlights
// the whole card in the module's shade color.
const ModuleCard = ({ mod, groups, totalCount, renderGroup }) => {
  const [hovered, setHovered] = useState(false);
  const shade = moduleShade(mod.id);
  return (
    <PageCard
      style={{
        borderColor: hovered
          ? `color-mix(in srgb, ${shade} 30%, transparent)`
          : undefined,
        boxShadow: hovered
          ? `0 6px 14px color-mix(in srgb, ${shade} 12%, transparent)`
          : undefined,
        transform: hovered ? "translateY(-1px)" : undefined,
        transition:
          "box-shadow var(--transition-normal), border-color var(--transition-fast), transform var(--transition-fast)",
      }}
    >
      <PageCardHeader
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="module-page__card-header">
          <div
            className="module-page__card-icon"
            style={{
              width: 46,
              height: 46,
              background: shade,
              color: "#fff",
              boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
            }}
          >
            {resolveMenuIcon(mod.icon, 28)}
          </div>
          <PageCardTitle
            title={`${mod.name} (${mod.id})`}
            titleStyle={{ color: shade, fontSize: 18 }}
            subtitle={`${totalCount} feature${totalCount === 1 ? "" : "s"}`}
          />
        </div>
      </PageCardHeader>
      <PageCardBody>
        {groups && groups.map((g) => renderGroup(g, shade))}
      </PageCardBody>
    </PageCard>
  );
};

const ModulePage = () => {
  const navigate = useNavigate();
  const {
    user,
    openPopup,
    popups,
    restorePopup,
    hidePopup,
    closePopup,
    hideAllPopups,
    closeAllPopups,
    pinnedMenuIds,
    togglePinMenu,
    menuOpenMode,
  } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentMenuIds, setRecentMenuIds] = useState([]);
  const [popupListOpen, setPopupListOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_STORAGE_KEY);
      if (stored) {
        const ids = JSON.parse(stored);
        if (Array.isArray(ids)) setRecentMenuIds(ids);
      }
    } catch (e) {
      /* ignore */
    }
  }, []);

  // Remember a menu in the Recent list (localStorage, most-recent first).
  const recordRecentMenu = (menu) => {
    setRecentMenuIds((prev) => {
      const filtered = prev.filter((id) => id !== menu.id);
      const updated = [menu.id, ...filtered].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        /* ignore */
      }
      return updated;
    });
  };

  const handleMenuClick = (menu) => {
    navigate(menu.menus_mlink);
    recordRecentMenu(menu);
  };

  // Opening a menu as a floating window also lands it in the Recent list.
  const handleOpenPopup = (menu) => {
    recordRecentMenu(menu);
    openPopup(menu);
  };

  // Pin/unpin a menu so it appears in the Pinned section + taskbar shortcuts.
  // Backed by shared context state so the taskbar updates immediately.
  const togglePin = (menu) => togglePinMenu(menu.id);

  const searchLC = searchQuery.toLowerCase();
  const filteredMenus = searchQuery
    ? menus.filter((m) => m.menus_mname.toLowerCase().includes(searchLC))
    : menus;

  const recentMenus = filteredMenus.filter((m) => recentMenuIds.includes(m.id));
  const pinnedMenus = filteredMenus.filter((m) => pinnedMenuIds.includes(m.id));
  const isSearching = searchQuery.trim().length > 0;

  // Time-of-day greeting: pick a welcome message + colorful icon.
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { text: "Good Morning", icon: <IconSunrise size={34} /> };
    }
    if (hour >= 12 && hour < 17) {
      return { text: "Good Afternoon", icon: <IconSun size={34} /> };
    }
    if (hour >= 17 && hour < 21) {
      return { text: "Good Evening", icon: <IconSunset size={34} /> };
    }
    return { text: "Good Night", icon: <IconMoon size={34} /> };
  };

  const greeting = getGreeting();
  const firstName = (user?.name || "").trim().split(/\s+/)[0];

  const renderGroup = (group, shade) => (
    <div key={group.id || group.name} style={{ marginBottom: 4 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          color: shade || "var(--text-muted)",
          padding: "8px 0 2px",
        }}
      >
        {group.id} · {group.name}
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          alignItems: "stretch",
        }}
      >
        {group.menus.map((m) => (
          <MenuCard
            key={m.id}
            menu={toMenu(m)}
            pinned={pinnedMenuIds.includes(m.id)}
            onClick={() => handleMenuClick(toMenu(m))}
            onTogglePin={togglePin}
            onOpenPopup={handleOpenPopup}
            openMode={menuOpenMode}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="page-wrap">
      <div className="module-page__header">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {greeting.icon}
          </span>
          <div>
            <h2 className="module-page__title">
              {greeting.text}
              {firstName ? `, ${firstName}` : ""}!
            </h2>
            <p className="module-page__subtitle">
              {appModules.length} applications &middot; {menus.length} features
            </p>
          </div>
        </div>
        <div style={popupListStyles.wrap}>
          <div style={modulePageSearchStyles.wrap}>
            <input
              type="text"
              style={modulePageSearchStyles.input}
              placeholder="Search menus…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--primary, #7c3aed)";
                e.target.style.boxShadow = "0 0 0 2px rgba(124, 58, 237, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border, #e0e0e0)";
                e.target.style.boxShadow = "none";
              }}
              aria-label="Search menus"
            />
            {searchQuery && (
              <button
                type="button"
                style={modulePageSearchStyles.clear}
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                title="Clear search"
              >
                <IconClose size={14} />
              </button>
            )}
          </div>
          <button
            type="button"
            style={{
              ...popupListStyles.trigger,
              background: popupListOpen
                ? "var(--primary, #7c3aed)"
                : "var(--surface, #fff)",
              borderColor: popupListOpen
                ? "var(--primary, #7c3aed)"
                : "var(--border, #e0e0e0)",
              color: popupListOpen
                ? "var(--primary-on, #fff)"
                : "var(--text-muted, #888)",
            }}
            onClick={() => setPopupListOpen((o) => !o)}
            title={
              popups.length
                ? "Show open windows"
                : "No open windows"
            }
            aria-label="Show open windows"
            aria-expanded={popupListOpen}
          >
            <IconPopup size={18} />
            {popups.length > 0 && (
              <span style={popupListStyles.badge}>{popups.length}</span>
            )}
          </button>
          {popupListOpen && (
            <div style={popupListStyles.panel}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  marginBottom: 6,
                  padding: "0 2px",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                    color: "var(--text-muted, #888)",
                  }}
                >
                  Windows ({popups.length})
                </span>
                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <button
                    type="button"
                    style={popupListStyles.action}
                    onClick={hideAllPopups}
                    title="Minimize all open windows"
                  >
                    <IconChevronDown size={12} />
                    Hide all
                  </button>
                  <button
                    type="button"
                    style={popupListStyles.action}
                    onClick={closeAllPopups}
                    title="Close all open windows"
                  >
                    <IconClose size={12} />
                    Close all
                  </button>
                  <button
                    type="button"
                    style={{
                      ...popupListStyles.action,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px",
                    }}
                    onClick={() => setPopupListOpen(false)}
                    aria-label="Close window list"
                    title="Close list"
                  >
                    <IconClose size={14} />
                  </button>
                </div>
              </div>
              {popups.length === 0 ? (
                <p
                  style={{
                    margin: 0,
                    padding: "12px 8px",
                    fontSize: 13,
                    color: "var(--text-muted, #888)",
                    textAlign: "center",
                  }}
                >
                  No open windows
                </p>
              ) : (
                popups.map((p) => (
                  <div
                    key={p.key}
                    style={popupListStyles.row}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background =
                        "var(--surface-alt, #f1f3f5)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <button
                      type="button"
                      style={popupListStyles.rowMain}
                      onClick={() => {
                        restorePopup(p.key);
                        setPopupListOpen(false);
                      }}
                      title={
                        p.hidden
                          ? `Open ${p.menu.menus_mname}`
                          : `Bring ${p.menu.menus_mname} to front`
                      }
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          flexShrink: 0,
                          color: moduleShade(p.menu.id),
                        }}
                      >
                        {p.menu.menus_micon}
                      </span>
                      <span
                        style={{
                          flex: 1,
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontWeight: p.hidden ? 500 : 600,
                        }}
                      >
                        {p.menu.menus_mname}
                      </span>
                      {p.hidden && (
                        <span
                          style={{
                            fontSize: 10,
                            padding: "1px 6px",
                            borderRadius: 999,
                            background: "var(--surface-alt, #f1f3f5)",
                            color: "var(--text-muted, #888)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          minimized
                        </span>
                      )}
                    </button>
                    {!p.hidden && (
                      <button
                        type="button"
                        style={popupListStyles.rowAction}
                        onClick={() => hidePopup(p.key)}
                        title={`Minimize ${p.menu.menus_mname}`}
                        aria-label={`Minimize ${p.menu.menus_mname}`}
                      >
                        <IconChevronDown size={14} />
                      </button>
                    )}
                    <button
                      type="button"
                      style={popupListStyles.rowAction}
                      onClick={() => closePopup(p.key)}
                      title={`Close ${p.menu.menus_mname}`}
                      aria-label={`Close ${p.menu.menus_mname}`}
                    >
                      <IconClose size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {isSearching && filteredMenus.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "48px 16px",
            color: "var(--text-muted, #888)",
          }}
        >
          <p style={{ fontSize: 16, margin: 0 }}>
            No menus match &quot;{searchQuery}&quot;
          </p>
        </div>
      )}

      <div className="module-page__list">
        {/* Pinned menus — starred favorites pinned by the user */}
        {pinnedMenus.length > 0 && (
          <PageCard>
            <PageCardHeader>
              <div className="module-page__card-header">
                <div
                  className="module-page__card-icon"
                  style={{
                    width: 46,
                    height: 46,
                    background: "var(--primary)",
                    color: "#fff",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
                  }}
                >
                  <IconStar size={28} fill="currentColor" />
                </div>
                <PageCardTitle
                  title="Pinned"
                  titleStyle={{ color: "var(--primary)", fontSize: 18 }}
                  subtitle={`${pinnedMenus.length} pinned`}
                />
              </div>
            </PageCardHeader>
            <PageCardBody>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  alignItems: "stretch",
                }}
              >
                {pinnedMenus.map((menu) => (
                  <MenuCard
                    key={menu.id}
                    menu={menu}
                    pinned
                    onClick={() => handleMenuClick(menu)}
                    onTogglePin={togglePin}
                    onOpenPopup={handleOpenPopup}
                    openMode={menuOpenMode}
                  />
                ))}
              </div>
            </PageCardBody>
          </PageCard>
        )}

        {/* Recent module */}
        {recentMenus.length > 0 && (
          <PageCard>
            <PageCardHeader>
              <div className="module-page__card-header">
                <div
                  className="module-page__card-icon"
                  style={{
                    width: 46,
                    height: 46,
                    background: "var(--primary)",
                    color: "#fff",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
                  }}
                >
                  <IconHome size={28} />
                </div>
                <PageCardTitle
                  title="Recent (M00)"
                  titleStyle={{ color: "var(--primary)", fontSize: 18 }}
                  subtitle={`${recentMenus.length} feature${recentMenus.length === 1 ? "" : "s"}`}
                />
                {!isSearching && (
                  <button
                    type="button"
                    onClick={() => {
                      setRecentMenuIds([]);
                      try {
                        localStorage.removeItem(RECENT_STORAGE_KEY);
                      } catch (e) {
                        /* ignore */
                      }
                    }}
                    style={{
                      marginLeft: "auto",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "4px 10px",
                      fontSize: 12,
                      borderRadius: 6,
                      border: "1px solid var(--border, #e0e0e0)",
                      background: "var(--surface, #fff)",
                      color: "var(--text-muted, #888)",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                    }}
                    title="Clear recent history"
                  >
                    <IconDelete size={14} />
                    Clear all
                  </button>
                )}
              </div>
            </PageCardHeader>
            <PageCardBody>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  alignItems: "stretch",
                }}
              >
                {recentMenus.map((menu) => (
                  <MenuCard
                    key={menu.id}
                    menu={menu}
                    pinned={pinnedMenuIds.includes(menu.id)}
                    onClick={() => handleMenuClick(menu)}
                    onTogglePin={togglePin}
                    onOpenPopup={handleOpenPopup}
                    openMode={menuOpenMode}
                  />
                ))}
              </div>
            </PageCardBody>
          </PageCard>
        )}

        {/* Module cards — iterate the tree directly */}
        {appModules
          .filter((mod) => mod.id !== "M00")
          .sort((a, b) => a.order - b.order)
          .map((mod) => {
            const hasGroups = mod.groups && mod.groups.length > 0;

            // Filter for search
            let groups = hasGroups ? [...mod.groups] : null;
            if (searchQuery) {
              const q = searchQuery.toLowerCase();
              if (groups) {
                groups = groups
                  .map((g) => ({
                    ...g,
                    menus: g.menus.filter((m) =>
                      m.name.toLowerCase().includes(q),
                    ),
                  }))
                  .filter((g) => g.menus.length > 0);
              }
              if (!groups || groups.length === 0) {
                return null;
              }
            }

            const totalCount =
              groups?.reduce((s, g) => s + g.menus.length, 0) || 0;
            if (totalCount === 0) return null;

            return (
              <ModuleCard
                key={mod.id}
                mod={mod}
                groups={
                  groups ? [...groups].sort((a, b) => a.order - b.order) : null
                }
                totalCount={totalCount}
                renderGroup={renderGroup}
              />
            );
          })}
      </div>

    </div>
  );
};

export default ModulePage;
