import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardBody,
} from "@/components/PageCard";
import Button from "@/components/Button";
import { useApp } from "@/context/AppContext";
import { IconHome, IconClose, IconDelete, IconPopup, IconChevronDown } from "@/icons";
import { resolveMenuIcon } from "@/utils/menuIcons";
import { appModules, menus, toMenu } from "@/utils/appModules";

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
const MenuCard = ({ menu, onClick, onOpenPopup }) => {
  const [hovered, setHovered] = useState(false);
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
        border: `1px solid ${hovered ? menu.menus_color + "40" : "var(--border)"}`,
        borderRadius: "var(--radius-xl)",
        background: hovered ? `${menu.menus_color}0d` : "var(--surface)",
        fontFamily: "var(--font-sans)",
        boxSizing: "border-box",
        transition: "all 0.15s ease",
        width: "auto",
        flex: "0 1 auto",
        boxShadow: hovered ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
        transform: hovered ? "translateY(-1px)" : "none",
      }}
    >
      <button
        type="button"
        onClick={onClick}
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
            width: 36,
            height: 36,
            borderRadius: "var(--radius-lg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            background: `${menu.menus_color}18`,
            color: menu.menus_color,
            fontSize: 18,
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
      <Button
        variant="ghost"
        size="sm"
        icon={<IconPopup size={16} />}
        onClick={(e) => {
          e.stopPropagation();
          onOpenPopup(menu);
        }}
        title={`Open ${menu.menus_mname} in popup`}
        aria-label={`Open ${menu.menus_mname} in popup`}
      />
    </div>
  );
};

const ModulePage = () => {
  const navigate = useNavigate();
  const {
    openPopup,
    popups,
    restorePopup,
    hidePopup,
    closePopup,
    hideAllPopups,
    closeAllPopups,
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

  const handleMenuClick = (menu) => {
    navigate(menu.menus_mlink);
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

  const searchLC = searchQuery.toLowerCase();
  const filteredMenus = searchQuery
    ? menus.filter((m) => m.menus_mname.toLowerCase().includes(searchLC))
    : menus;

  const recentMenus = filteredMenus.filter((m) => recentMenuIds.includes(m.id));
  const isSearching = searchQuery.trim().length > 0;

  const renderGroup = (group) => (
    <div key={group.id || group.name} style={{ marginBottom: 4 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          color: "var(--text-muted)",
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
            onClick={() => handleMenuClick(toMenu(m))}
            onOpenPopup={openPopup}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="page-wrap">
      <div className="module-page__header">
        <div>
          <h2 className="module-page__title">Applications</h2>
          <p className="module-page__subtitle">
            {appModules.length} applications &middot; {menus.length} features
          </p>
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
                ? "Show open popups"
                : "No open popups"
            }
            aria-label="Show open popups"
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
                  Popups ({popups.length})
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
                    title="Minimize all open popups"
                  >
                    <IconChevronDown size={12} />
                    Hide all
                  </button>
                  <button
                    type="button"
                    style={popupListStyles.action}
                    onClick={closeAllPopups}
                    title="Close all open popups"
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
                    aria-label="Close popup list"
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
                  No open popups
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
                          color: p.menu.menus_color,
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
        {/* Recent module */}
        {recentMenus.length > 0 && (
          <PageCard>
            <PageCardHeader>
              <div className="module-page__card-header">
                <div
                  className="module-page__card-icon"
                  style={{ background: "#7c3aed18" }}
                >
                  <IconHome />
                </div>
                <PageCardTitle
                  title="Recent (M00)"
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
                    onClick={() => handleMenuClick(menu)}
                    onOpenPopup={openPopup}
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
              <PageCard key={mod.id}>
                <PageCardHeader>
                  <div className="module-page__card-header">
                    <div
                      className="module-page__card-icon"
                      style={{ background: `${mod.color}18` }}
                    >
                      {resolveMenuIcon(mod.icon)}
                    </div>
                    <PageCardTitle
                      title={`${mod.name} (${mod.id})`}
                      subtitle={`${totalCount} feature${totalCount === 1 ? "" : "s"}`}
                    />
                  </div>
                </PageCardHeader>
                <PageCardBody>
                  {groups &&
                    groups.sort((a, b) => a.order - b.order).map(renderGroup)}
                </PageCardBody>
              </PageCard>
            );
          })}
      </div>

    </div>
  );
};

export default ModulePage;
