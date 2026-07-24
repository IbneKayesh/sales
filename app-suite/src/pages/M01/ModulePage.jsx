import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardBody,
} from "@/components/PageCard";
import {
  IconHome,
  IconAccounts,
  IconActivity,
  IconFile,
  IconUsers,
  IconManufacture,
  IconCRM,
  IconBox,
  IconHR,
  IconClose,
} from "@/icons";

const modules = [
  {
    id: "M00",
    menus_mname: "Recent",
    menus_micon: <IconHome />,
    menus_color: "#7c3aed",
    menus_odrby: 0,
  },
  {
    id: "M01",
    menus_mname: "Dashboard",
    menus_micon: <IconHome />,
    menus_color: "#7c3aed",
    menus_odrby: 1,
  },
  {
    id: "M04",
    menus_mname: "Inventory",
    menus_micon: <IconBox />,
    menus_color: "#f97316",
    menus_odrby: 4,
  },
  {
    id: "M05",
    menus_mname: "Manufacturing",
    menus_micon: <IconManufacture />,
    menus_color: "#22c55e",
    menus_odrby: 5,
  },
  {
    id: "M06",
    menus_mname: "CRM",
    menus_micon: <IconCRM />,
    menus_color: "#3b82f6",
    menus_odrby: 6,
  },
  {
    id: "M07",
    menus_mname: "HRMS",
    menus_micon: <IconHR />,
    menus_color: "#22c55e",
    menus_odrby: 7,
  },
  {
    id: "M08",
    menus_mname: "Accounts",
    menus_micon: <IconAccounts />,
    menus_color: "#22c55e",
    menus_odrby: 8,
  },
  {
    id: "M09",
    menus_mname: "Examples",
    menus_micon: <IconActivity />,
    menus_color: "#f59e0b",
    menus_odrby: 9,
  },
];

const menus = [
  {
    id: "M01-M01-M001",
    menus_mname: "Home",
    menus_color: "#f59e0b",
    menus_micon: <IconHome />,
    menus_odrby: 1,
    menus_mlink: "/",
    menus_menus: "M01",
  },
  {
    id: "M04-M01-M001",
    menus_mname: "Brands",
    menus_color: "#f97316",
    menus_micon: <IconBox />,
    menus_odrby: 1,
    menus_mlink: "/inventory/setup/brands",
    menus_menus: "M04",
  },
  {
    id: "M04-M02-M001",
    menus_mname: "Categories",
    menus_color: "#f97316",
    menus_micon: <IconBox />,
    menus_odrby: 2,
    menus_mlink: "/inventory/setup/categories",
    menus_menus: "M04",
  },
  {
    id: "M04-M03-M001",
    menus_mname: "Groups",
    menus_color: "#f97316",
    menus_micon: <IconBox />,
    menus_odrby: 3,
    menus_mlink: "/inventory/setup/groups",
    menus_menus: "M04",
  },
  {
    id: "M04-M07-M001",
    menus_mname: "Units",
    menus_color: "#f97316",
    menus_micon: <IconBox />,
    menus_odrby: 7,
    menus_mlink: "/inventory/setup/units",
    menus_menus: "M04",
  },
  {
    id: "M04-M07-M002",
    menus_mname: "Items",
    menus_color: "#f97316",
    menus_micon: <IconBox />,
    menus_odrby: 7,
    menus_mlink: "/inventory/setup/items",
    menus_menus: "M04",
  },
  {
    id: "M05-M01-M001",
    menus_mname: "Productions",
    menus_color: "#f59e0b",
    menus_micon: <IconManufacture />,
    menus_odrby: 1,
    menus_mlink: "/manufacturing/setup/productions",
    menus_menus: "M05",
  },
  {
    id: "M05-M01-M002",
    menus_mname: "BOM",
    menus_color: "#f59e0b",
    menus_micon: <IconManufacture />,
    menus_odrby: 2,
    menus_mlink: "/manufacturing/setup/bom",
    menus_menus: "M05",
  },
  {
    id: "M05-M02-M001",
    menus_mname: "Process",
    menus_color: "#f59e0b",
    menus_micon: <IconManufacture />,
    menus_odrby: 3,
    menus_mlink: "/manufacturing/process",
    menus_menus: "M05",
  },
  {
    id: "M06-M01-M001",
    menus_mname: "Contacts",
    menus_color: "#3b82f6",
    menus_micon: <IconCRM />,
    menus_odrby: 1,
    menus_mlink: "/M06/contacts",
    menus_menus: "M06",
  },
  {
    id: "M06-M01-M002",
    menus_mname: "Delivery Zones",
    menus_color: "#3b82f6",
    menus_micon: <IconCRM />,
    menus_odrby: 2,
    menus_mlink: "/M06/delivery-zones",
    menus_menus: "M06",
  },
  {
    id: "M06-M01-M003",
    menus_mname: "Territory Areas",
    menus_color: "#3b82f6",
    menus_micon: <IconCRM />,
    menus_odrby: 3,
    menus_mlink: "/M06/territory-areas",
    menus_menus: "M06",
  },
  {
    id: "M06-M01-M004",
    menus_mname: "Territories",
    menus_color: "#3b82f6",
    menus_micon: <IconCRM />,
    menus_odrby: 4,
    menus_mlink: "/M06/territories",
    menus_menus: "M06",
  },
  {
    id: "M07-M0002",
    menus_mname: "Working Shift",
    menus_color: "#3b82f6",
    menus_micon: <IconHR />,
    menus_odrby: 2,
    menus_mlink: "/hrms/setup/work-shifts",
    menus_menus: "M07",
  },
  {
    id: "M07-M0004",
    menus_mname: "Holidays",
    menus_color: "#3b82f6",
    menus_micon: <IconHR />,
    menus_odrby: 4,
    menus_mlink: "/hrms/setup/holidays",
    menus_menus: "M07",
  },
  {
    id: "M08-M0001",
    menus_mname: "Chart of Accounts",
    menus_color: "#f59e0b",
    menus_micon: <IconAccounts />,
    menus_odrby: 1,
    menus_mlink: "/accounts/setup/chart-of-accounts",
    menus_menus: "M08",
  },
  {
    id: "M08-M0006",
    menus_mname: "Fiscal Years",
    menus_color: "#f59e0b",
    menus_micon: <IconAccounts />,
    menus_odrby: 4,
    menus_mlink: "/accounts/setup/fiscal-years",
    menus_menus: "M08",
  },
  {
    id: "M08-M0007",
    menus_mname: "Accounting Periods",
    menus_color: "#f59e0b",
    menus_micon: <IconAccounts />,
    menus_odrby: 2,
    menus_mlink: "/accounts/setup/accounting-periods",
    menus_menus: "M08",
  },
  {
    id: "M08-M01-M002",
    menus_mname: "Party Accounts",
    menus_color: "#f59e0b",
    menus_micon: <IconUsers />,
    menus_odrby: 2,
    menus_mlink: "/M08/parties",
    menus_menus: "M08",
  },
  {
    id: "M09-M01-M001",
    menus_mname: "Reports",
    menus_color: "#f59e0b",
    menus_micon: <IconFile />,
    menus_odrby: 1,
    menus_mlink: "/reports",
    menus_menus: "M09",
  },
  {
    id: "M09-M01-M002",
    menus_mname: "Transactions",
    menus_color: "#f59e0b",
    menus_micon: <IconFile />,
    menus_odrby: 1,
    menus_mlink: "/transactions",
    menus_menus: "M09",
  },
  {
    id: "M09-M01-M004",
    menus_mname: "Users",
    menus_color: "#f59e0b",
    menus_micon: <IconFile />,
    menus_odrby: 1,
    menus_mlink: "/users",
    menus_menus: "M09",
  },
  {
    id: "M09-M01-M005",
    menus_mname: "Settings",
    menus_color: "#f59e0b",
    menus_micon: <IconFile />,
    menus_odrby: 1,
    menus_mlink: "/settings",
    menus_menus: "M09",
  },
  {
    id: "M09-M01-M006",
    menus_mname: "UI Examples",
    menus_color: "#f59e0b",
    menus_micon: <IconFile />,
    menus_odrby: 1,
    menus_mlink: "/examples",
    menus_menus: "M09",
  },
  {
    id: "M09-M01-M007",
    menus_mname: "Modules",
    menus_color: "#f59e0b",
    menus_micon: <IconFile />,
    menus_odrby: 1,
    menus_mlink: "/M01/modules",
    menus_menus: "M09",
  },
];

// Topbar navigation items — sourced from here so ModulePage is the menu authority
export const navItems = [
  { to: "/", label: "Dashboard", icon: "◉" },
  { to: "/users", label: "Users", icon: "◐" },
  { to: "/transactions", label: "Transactions", icon: "◈" },
  { to: "/reports", label: "Reports", icon: "▣" },
  { to: "/settings", label: "Settings", icon: "⚙" },
  { to: "/examples", label: "Examples", icon: "✦" },
  { to: "/notifications", label: "Notifications", icon: "◉" },
  { to: "/M06/contacts", label: "Contacts", icon: "⊕" },
  { to: "/M08/chart-of-accounts", label: "COA", icon: "◐" },
  { to: "/M08/accounting-periods", label: "Periods", icon: "◈" },
  { to: "/M08/fiscal-years", label: "Fiscal Yr", icon: "▣" },
  { to: "/M08/parties", label: "Parties", icon: "⊕" },
  { to: "/M01/modules", label: "Modules", icon: "⊞" },
];

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

const ModulePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentMenuIds, setRecentMenuIds] = useState([]);

  // Load recent menu IDs from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_STORAGE_KEY);
      if (stored) {
        const ids = JSON.parse(stored);
        if (Array.isArray(ids)) {
          setRecentMenuIds(ids);
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  const handleMenuClick = (menu) => {
    navigate(menu.menus_mlink);
    // Update recent list — distinct, most recent first
    setRecentMenuIds((prev) => {
      const filtered = prev.filter((id) => id !== menu.id);
      const updated = [menu.id, ...filtered].slice(0, MAX_RECENT);
      try {
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        // ignore storage errors
      }
      return updated;
    });
  };

  // Filter menus by search query
  const filteredMenus = searchQuery
    ? menus.filter((menu) =>
        menu.menus_mname.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : menus;

  // Recent menus that also match the current search/filter
  const recentMenus = filteredMenus.filter((m) => recentMenuIds.includes(m.id));

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="page-wrap">
      <div className="module-page__header">
        <div>
          <h2 className="module-page__title">Applications</h2>
          <p className="module-page__subtitle">
            {modules.length} applications &middot; {menus.length} features
          </p>
        </div>
        {/* Search input */}
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
      </div>

      {/* No results state */}
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
        {/* Recent module — only when not searching OR recent menus match search */}
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
                        // ignore
                      }
                    }}
                    style={{
                      marginLeft: "auto",
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
                    Clear all
                  </button>
                )}
              </div>
            </PageCardHeader>
            <PageCardBody>
              <div className="module-page__menu-grid">
                {recentMenus.map((menu) => (
                  <button
                    key={menu.id}
                    type="button"
                    className="module-page__menu-item"
                    onClick={() => handleMenuClick(menu)}
                    title={menu.menus_mname}
                  >
                    <div
                      className="module-page__menu-icon"
                      style={{ background: `${menu.menus_color}18` }}
                    >
                      {menu.menus_micon}
                    </div>
                    <span className="module-page__menu-label">
                      {menu.menus_mname}
                    </span>
                  </button>
                ))}
              </div>
            </PageCardBody>
          </PageCard>
        )}

        {[...modules]
          .filter((mod) => mod.id !== "M00") // Recent is rendered above separately
          .sort((a, b) => a.menus_odrby - b.menus_odrby)
          .map((module) => {
            const modMenus = filteredMenus.filter(
              (menu) => menu.menus_menus === module.id,
            );
            if (modMenus.length === 0) return null;

            return (
              <PageCard key={module.id}>
                <PageCardHeader>
                  <div className="module-page__card-header">
                    <div
                      className="module-page__card-icon"
                      style={{ background: `${module.menus_color}18` }}
                    >
                      {module.menus_micon}
                    </div>
                    <PageCardTitle
                      title={`${module.menus_mname} (${module.id})`}
                      subtitle={`${modMenus.length} feature${modMenus.length === 1 ? "" : "s"}`}
                    />
                  </div>
                </PageCardHeader>
                <PageCardBody>
                  <div className="module-page__menu-grid">
                    {modMenus.map((menu) => (
                      <button
                        key={menu.id}
                        type="button"
                        className="module-page__menu-item"
                        onClick={() => handleMenuClick(menu)}
                        title={menu.menus_mname}
                      >
                        <div
                          className="module-page__menu-icon"
                          style={{ background: `${menu.menus_color}18` }}
                        >
                          {menu.menus_micon}
                        </div>
                        <span className="module-page__menu-label">
                          {menu.menus_mname}
                        </span>
                      </button>
                    ))}
                  </div>
                </PageCardBody>
              </PageCard>
            );
          })}
      </div>
    </div>
  );
};

export default ModulePage;
