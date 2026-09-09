import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardBody,
} from "@/components/PageCard";
import MenuCard from "@/components/MenuCard";
import PopupList from "@/components/PopupList";
import GreetingHeader from "@/components/GreetingHeader";
import { useApp } from "@/context/AppContext";
import {
  IconHome,
  IconClose,
  IconDelete,
  IconPopup,
  IconStar,
} from "@/icons";
import { resolveMenuIcon } from "@/icons";
import { appModules, menus, toMenu } from "@/utils/appModules";
import { moduleShade } from "@/utils/theme";
import "./ModulePage.css";

const RECENT_STORAGE_KEY = "bsuite_recent_menus";
const MAX_RECENT = 20;

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

  const renderGroup = (group, shade) => (
    <div key={group.id || group.name}>
      <div
        className="module-card__group-title"
        style={{ color: shade || "var(--text-muted)" }}
      >
        {group.id} · {group.name}
      </div>
      <div className="module-card__menu-grid">
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
        <GreetingHeader
          userName={user?.name}
          subtitle={`${appModules.length} applications \u00b7 ${menus.length} features`}
        />
        <div className="module-page__popup-trigger-wrap">
          <div className="module-page__search-wrap">
            <input
              type="text"
              className="module-page__search-input"
              placeholder="Search menus…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search menus"
            />
            {searchQuery && (
              <button
                type="button"
                className="module-page__search-clear"
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
            className={`module-page__popup-trigger${popupListOpen ? " module-page__popup-trigger--active" : ""}`}
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
              <span className="module-page__popup-badge">{popups.length}</span>
            )}
          </button>
          <PopupList
            popups={popups}
            open={popupListOpen}
            onToggle={() => setPopupListOpen(false)}
            onRestore={restorePopup}
            onHide={hidePopup}
            onClose={closePopup}
            onHideAll={hideAllPopups}
            onCloseAll={closeAllPopups}
          />
        </div>
      </div>

      {isSearching && filteredMenus.length === 0 && (
        <div className="module-page__empty">
          <p>No menus match &quot;{searchQuery}&quot;</p>
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
              <div className="module-card__menu-grid">
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
                    className="module-page__clear-btn"
                    onClick={() => {
                      setRecentMenuIds([]);
                      try {
                        localStorage.removeItem(RECENT_STORAGE_KEY);
                      } catch (e) {
                        /* ignore */
                      }
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
              <div className="module-card__menu-grid">
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
