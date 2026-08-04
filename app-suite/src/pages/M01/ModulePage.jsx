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
  IconSettings,
  IconPurchase,
  IconSales,
} from "@/icons";

/* ─── Hierarchical App Data: Module > Groups > Menu ─────── */

const iconMap = {
  Home: IconHome,
  Settings: IconSettings,
  Box: IconBox,
  Manufacture: IconManufacture,
  CRM: IconCRM,
  HR: IconHR,
  Accounts: IconAccounts,
  Activity: IconActivity,
  File: IconFile,
  Users: IconUsers,
  Purchase: IconPurchase,
  Sales: IconSales,
};

const resolveIcon = (name) => {
  const Icon = iconMap[name];
  return Icon ? <Icon /> : null;
};

/** Build a menu item object from a data entry */
const toMenu = (m) => ({
  id: m.id,
  menus_mname: m.name,
  menus_color: m.color,
  menus_micon: resolveIcon(m.icon),
  menus_odrby: m.order,
  menus_mlink: m.link,
  menus_mdesc: m.desc,
});

const appModules = [
  {
    id: "M00",
    name: "Recent",
    icon: "Home",
    color: "#7c3aed",
    order: 0,
    menus: [],
  },
  {
    id: "M01",
    name: "Settings",
    icon: "Settings",
    color: "#7c3aed",
    order: 1,
    groups: [
      {
        id: "G01",
        name: "General",
        order: 1,
        menus: [
          {
            id: "M01-G01-M001",
            name: "Home",
            color: "#7c3aed",
            icon: "Home",
            order: 1,
            link: "/",
            desc: "Return to dashboard overview",
          },
        ],
      },
      {
        id: "G02",
        name: "Setup",
        order: 2,
        menus: [
          {
            id: "M01-G02-M001",
            name: "Departments",
            color: "#7c3aed",
            icon: "Home",
            order: 8,
            link: "/settings/departments",
            desc: "Manage organizational departments",
          },
          {
            id: "M01-G02-M002",
            name: "Sections",
            color: "#7c3aed",
            icon: "Home",
            order: 9,
            link: "/settings/sections",
            desc: "Configure department sections",
          },
        ],
      },
    ],
  },
  {
    id: "M02",
    name: "Purchase",
    icon: "Purchase",
    color: "#06b6d4",
    order: 2,
    groups: [
      {
        id: "G01",
        name: "Setup",
        order: 1,
        menus: [
          {
            id: "M02-G01-M001",
            name: "Suppliers",
            color: "#06b6d4",
            icon: "Purchase",
            order: 1,
            link: "/purchase/setup/suppliers",
            desc: "Manage vendor and supplier profiles",
          },
          {
            id: "M02-G01-M002",
            name: "Purchase Categories",
            color: "#06b6d4",
            icon: "Purchase",
            order: 2,
            link: "/purchase/setup/categories",
            desc: "Organize purchase item categories",
          },
        ],
      },
      {
        id: "G02",
        name: "Transactions",
        order: 2,
        menus: [
          {
            id: "M02-G02-M001",
            name: "Purchase Orders",
            color: "#06b6d4",
            icon: "Purchase",
            order: 1,
            link: "/purchase/orders",
            desc: "Create and track purchase orders",
          },
          {
            id: "M02-G02-M002",
            name: "Purchase Requisitions",
            color: "#06b6d4",
            icon: "Purchase",
            order: 2,
            link: "/purchase/requisitions",
            desc: "Manage purchase requisition requests",
          },
          {
            id: "M02-G02-M003",
            name: "Goods Receipt",
            color: "#06b6d4",
            icon: "Purchase",
            order: 3,
            link: "/purchase/goods-receipt",
            desc: "Record received goods and inspections",
          },
          {
            id: "M02-G02-M004",
            name: "MRR (Direct)",
            color: "#06b6d4",
            icon: "Purchase",
            order: 4,
            link: "/purchase/mrr-direct",
            desc: "Record received goods and inspections",
          },
        ],
      },
    ],
  },
  {
    id: "M03",
    name: "Sales",
    icon: "Sales",
    color: "#eab308",
    order: 3,
    groups: [
      {
        id: "G01",
        name: "Setup",
        order: 1,
        menus: [
          {
            id: "M03-G01-M001",
            name: "Customers",
            color: "#eab308",
            icon: "Sales",
            order: 1,
            link: "/sales/setup/customers",
            desc: "Manage customer account profiles",
          },
          {
            id: "M03-G01-M002",
            name: "Sales Teams",
            color: "#eab308",
            icon: "Sales",
            order: 2,
            link: "/sales/setup/teams",
            desc: "Configure sales team structures",
          },
          {
            id: "M03-G01-M003",
            name: "Sales Targets",
            color: "#eab308",
            icon: "Sales",
            order: 3,
            link: "/sales/setup/targets",
            desc: "Set revenue and volume targets",
          },
        ],
      },
      {
        id: "G02",
        name: "Transactions",
        order: 2,
        menus: [
          {
            id: "M03-G02-M001",
            name: "Sales Orders",
            color: "#eab308",
            icon: "Sales",
            order: 1,
            link: "/sales/orders",
            desc: "Process customer sales orders",
          },
          {
            id: "M03-G02-M002",
            name: "Deliveries",
            color: "#eab308",
            icon: "Sales",
            order: 2,
            link: "/sales/deliveries",
            desc: "Manage delivery and dispatch records",
          },
          {
            id: "M03-G02-M003",
            name: "Sales Returns",
            color: "#eab308",
            icon: "Sales",
            order: 3,
            link: "/sales/returns",
            desc: "Handle customer return requests",
          },
        ],
      },
    ],
  },
  {
    id: "M04",
    name: "Inventory",
    icon: "Box",
    color: "#f97316",
    order: 4,
    groups: [
      {
        id: "G01",
        name: "Setup",
        order: 1,
        menus: [
          {
            id: "M04-G01-M001",
            name: "Brands",
            color: "#f97316",
            icon: "Box",
            order: 1,
            link: "/inventory/setup/brands",
            desc: "Manage product brand profiles",
          },
          {
            id: "M04-G01-M002",
            name: "Categories",
            color: "#f97316",
            icon: "Box",
            order: 2,
            link: "/inventory/setup/categories",
            desc: "Organize product categories",
          },
          {
            id: "M04-G01-M003",
            name: "Groups",
            color: "#f97316",
            icon: "Box",
            order: 3,
            link: "/inventory/setup/groups",
            desc: "Manage product group classifications",
          },
          {
            id: "M04-G01-M004",
            name: "Units",
            color: "#f97316",
            icon: "Box",
            order: 7,
            link: "/inventory/setup/units",
            desc: "Configure measurement units",
          },
          {
            id: "M04-G01-M005",
            name: "Items",
            color: "#f97316",
            icon: "Box",
            order: 7,
            link: "/inventory/setup/items",
            desc: "Manage inventory item records",
          },
        ],
      },
    ],
  },
  {
    id: "M05",
    name: "Manufacturing",
    icon: "Manufacture",
    color: "#22c55e",
    order: 5,
    groups: [
      {
        id: "G01",
        name: "Setup",
        order: 1,
        menus: [
          {
            id: "M05-G01-M001",
            name: "Productions",
            color: "#22c55e",
            icon: "Manufacture",
            order: 1,
            link: "/manufacturing/setup/productions",
            desc: "Track and manage manufacturing runs",
          },
          {
            id: "M05-G01-M002",
            name: "BOM",
            color: "#22c55e",
            icon: "Manufacture",
            order: 2,
            link: "/manufacturing/setup/bom",
            desc: "Bill of Materials structure",
          },
        ],
      },
      {
        id: "G02",
        name: "Operations",
        order: 2,
        menus: [
          {
            id: "M05-G02-M001",
            name: "Process",
            color: "#22c55e",
            icon: "Manufacture",
            order: 3,
            link: "/manufacturing/process",
            desc: "Manage production process flows",
          },
        ],
      },
    ],
  },
  {
    id: "M06",
    name: "CRM",
    icon: "CRM",
    color: "#3b82f6",
    order: 6,
    groups: [
      {
        id: "G01",
        name: "Contacts",
        order: 1,
        menus: [
          {
            id: "M06-G01-M001",
            name: "Contacts",
            color: "#3b82f6",
            icon: "CRM",
            order: 1,
            link: "/M06/contacts",
            desc: "Manage business contact records",
          },
        ],
      },
      {
        id: "G02",
        name: "Setup",
        order: 2,
        menus: [
          {
            id: "M06-G02-M001",
            name: "Territories",
            color: "#3b82f6",
            icon: "CRM",
            order: 2,
            link: "/crm/setup/territories",
            desc: "Define sales territory boundaries",
          },
          {
            id: "M06-G02-M002",
            name: "Thana / Area",
            color: "#3b82f6",
            icon: "CRM",
            order: 3,
            link: "/crm/setup/thana-areas",
            desc: "Manage thana and area zones",
          },
          {
            id: "M06-G02-M003",
            name: "District / Zone",
            color: "#3b82f6",
            icon: "CRM",
            order: 4,
            link: "/crm/setup/district-zones",
            desc: "Configure district and zone regions",
          },
        ],
      },
    ],
  },
  {
    id: "M07",
    name: "HRMS",
    icon: "HR",
    color: "#ec4899",
    order: 7,
    groups: [
      {
        id: "G01",
        name: "Setup",
        order: 1,
        menus: [
          {
            id: "M07-G01-M001",
            name: "Working Shift",
            color: "#ec4899",
            icon: "HR",
            order: 2,
            link: "/hrms/setup/work-shifts",
            desc: "Set employee work shift schedules",
          },
          {
            id: "M07-G01-M002",
            name: "Holidays",
            color: "#ec4899",
            icon: "HR",
            order: 4,
            link: "/hrms/setup/holidays",
            desc: "Manage holiday calendar entries",
          },
        ],
      },
    ],
  },
  {
    id: "M08",
    name: "Accounts",
    icon: "Accounts",
    color: "#8b5cf6",
    order: 8,
    groups: [
      {
        id: "G01",
        name: "Setup",
        order: 1,
        menus: [
          {
            id: "M08-G01-M001",
            name: "Chart of Accounts",
            color: "#8b5cf6",
            icon: "Accounts",
            order: 1,
            link: "/accounts/setup/chart-of-accounts",
            desc: "Configure the chart of accounts",
          },
          {
            id: "M08-G01-M002",
            name: "Fiscal Years",
            color: "#8b5cf6",
            icon: "Accounts",
            order: 2,
            link: "/accounts/setup/fiscal-years",
            desc: "Manage fiscal year periods",
          },
          {
            id: "M08-G01-M003",
            name: "Accounting Periods",
            color: "#8b5cf6",
            icon: "Accounts",
            order: 3,
            link: "/accounts/setup/accounting-periods",
            desc: "Set accounting period date ranges",
          },
          {
            id: "M08-G01-M004",
            name: "Party Accounts",
            color: "#8b5cf6",
            icon: "Users",
            order: 4,
            link: "/accounts/setup/parties",
            desc: "Manage party account profiles",
          },
          {
            id: "M08-G01-M005",
            name: "Party Routing",
            color: "#8b5cf6",
            icon: "Users",
            order: 5,
            link: "/accounts/setup/party-network",
            desc: "Party accounts network routing",
          },
        ],
      },
      {
        id: "G02",
        name: "Transactions",
        order: 2,
        menus: [
          {
            id: "M08-G02-M001",
            name: "Journals",
            color: "#8b5cf6",
            icon: "Users",
            order: 5,
            link: "/accounts/journals",
            desc: "Record financial journal entries",
          },
        ],
      },
      {
        id: "G03",
        name: "Reports",
        order: 3,
        menus: [
          {
            id: "M08-G03-M001",
            name: "Financial Statements",
            color: "#8b5cf6",
            icon: "File",
            order: 1,
            link: "/accounts/reports/fstatements",
            desc: "Financial Statements",
          },
          {
            id: "M08-G03-M002",
            name: "Financial Statements (old)",
            color: "#8b5cf6",
            icon: "File",
            order: 1,
            link: "/accounts/reports/fstatements-bk",
            desc: "Financial Statements",
          },
        ],
      },
    ],
  },
  {
    id: "M09",
    name: "Examples",
    icon: "Activity",
    color: "#f59e0b",
    order: 9,
    groups: [
      {
        id: "G01",
        name: "Reports",
        order: 1,
        menus: [
          {
            id: "M09-G01-M001",
            name: "Reports",
            color: "#f59e0b",
            icon: "File",
            order: 1,
            link: "/reports",
            desc: "View and generate system reports",
          },
        ],
      },
      {
        id: "G02",
        name: "Transactions",
        order: 2,
        menus: [
          {
            id: "M09-G02-M001",
            name: "Transactions",
            color: "#f59e0b",
            icon: "File",
            order: 1,
            link: "/transactions",
            desc: "Browse all system transactions",
          },
        ],
      },
      {
        id: "G03",
        name: "Admin",
        order: 3,
        menus: [
          {
            id: "M09-G03-M001",
            name: "Users",
            color: "#f59e0b",
            icon: "File",
            order: 1,
            link: "/users",
            desc: "Manage system user accounts",
          },
          {
            id: "M09-G03-M002",
            name: "Settings",
            color: "#f59e0b",
            icon: "File",
            order: 1,
            link: "/settings",
            desc: "Configure system preferences",
          },
        ],
      },
      {
        id: "G04",
        name: "Examples",
        order: 4,
        menus: [
          {
            id: "M09-G04-M001",
            name: "UI Examples",
            color: "#f59e0b",
            icon: "File",
            order: 1,
            link: "/examples",
            desc: "Browse UI component examples",
          },
          {
            id: "M09-G04-M002",
            name: "TreeView Examples",
            color: "#22c55e",
            icon: "File",
            order: 2,
            link: "/examples/treeview",
            desc: "Explore TreeView component demos",
          },
        ],
      },
      {
        id: "G05",
        name: "Navigation",
        order: 5,
        menus: [
          {
            id: "M09-G05-M001",
            name: "Modules",
            color: "#f59e0b",
            icon: "File",
            order: 1,
            link: "/M01/modules",
            desc: "Browse all application modules",
          },
        ],
      },
    ],
  },
];

// Build the flat menus array used for search & recent menus
const menus = appModules.flatMap((mod) => {
  const items = [];
  if (mod.groups) {
    for (const g of mod.groups) {
      for (const m of g.menus) {
        items.push({
          ...toMenu(m),
          menus_mgrup: g.name,
          menus_mgrup_id: g.id,
          menus_mgrup_order: g.order,
        });
      }
    }
  }
  return items;
});

// Topbar navigation items
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

  const MenuCard = ({ menu, onClick }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <button
        type="button"
        onClick={onClick}
        title={menu.menus_mname}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 8px",
          border: `1px solid ${hovered ? menu.menus_color + "40" : "var(--border)"}`,
          borderRadius: "var(--radius-xl)",
          background: hovered ? `${menu.menus_color}0d` : "var(--surface)",
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
          textAlign: "left",
          outline: "none",
          boxSizing: "border-box",
          transition: "all 0.15s ease",
          width: "auto",
          flex: "0 1 auto",
          boxShadow: hovered ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
          transform: hovered ? "translateY(-1px)" : "none",
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
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
            }}
          >
            {menu.menus_mdesc}
          </span>
        </div>
      </button>
    );
  };

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
                      {resolveIcon(mod.icon)}
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
