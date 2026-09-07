import { resolveMenuIcon } from "@/icons";
import { getStorageData } from "@/utils/storage";

/* ─── Hierarchical App Data: Module > Groups > Menu ─────── */

/** Build a menu item object from a data entry */
export const toMenu = (m) => ({
  id: m.id,
  menus_mname: m.name,
  menus_color: m.color,
  menus_micon: resolveMenuIcon(m.icon),
  menus_micon_name: m.icon,
  menus_odrby: m.order,
  menus_mlink: m.link,
  menus_mdesc: m.desc,
});

export const rawAppModules = [
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
          {
            id: "M01-G01-M002",
            name: "Work Space",
            color: "#7c3aed",
            icon: "Monitor",
            order: 2,
            link: "/bsuite/workspace",
            desc: "Work Space",
          },
          {
            id: "M01-G01-M003",
            name: "Features",
            color: "#7c3aed",
            icon: "Palette",
            order: 3,
            link: "/bsuite/features",
            desc: "Application feature list",
          },
          {
            id: "M01-G01-M004",
            name: "Theme",
            color: "#7c3aed",
            icon: "Palette",
            order: 4,
            link: "/bsuite/theme",
            desc: "Application preferences and theme color",
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
            icon: "Building",
            order: 1,
            link: "/settings/departments",
            desc: "Manage organizational departments",
          },
          {
            id: "M01-G02-M002",
            name: "Sections",
            color: "#7c3aed",
            icon: "Layers",
            order: 2,
            link: "/settings/sections",
            desc: "Configure department sections",
          },
          {
            id: "M01-G02-M003",
            name: "Users",
            color: "#7c3aed",
            icon: "User",
            order: 3,
            link: "/settings/users",
            desc: "Configure Users",
          },
          {
            id: "M01-G02-M004",
            name: "Grid Options",
            color: "#7c3aed",
            icon: "Columns",
            order: 4,
            link: "/settings/grid-options",
            desc: "Configure module table column visibility",
          },
          {
            id: "M01-G02-M005",
            name: "Pending Process",
            color: "#7c3aed",
            icon: "Target",
            order: 5,
            link: "/settings/pending-process",
            desc: "Pending process",
          },
        ],
      },
    ],
  },
  {
    id: "M02",
    name: "Sales",
    icon: "Sales",
    color: "#eab308",
    order: 2,
    groups: [
      {
        id: "G01",
        name: "Setup",
        order: 1,
        menus: [
          {
            id: "M02-G01-M001",
            name: "Sales Bundles",
            color: "#eab308",
            icon: "Target",
            order: 1,
            link: "/sales/setup/sales-bundles",
            desc: "Manage bundle sales",
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
            name: "Point of Sale",
            color: "#f59e0b",
            icon: "Calculator",
            order: 1,
            link: "/sales/pos",
            desc: "Quick POS terminal with product grid and checkout",
          },
          {
            id: "M02-G02-M002",
            name: "Sales Invoice",
            color: "#eab308",
            icon: "Receipt",
            order: 2,
            link: "/sales/invoice",
            desc: "Process customer sales invoice",
          },
          {
            id: "M02-G02-M003",
            name: "Deliveries",
            color: "#eab308",
            icon: "Truck",
            order: 3,
            link: "/sales/deliveries",
            desc: "Manage delivery and dispatch records",
          },
          {
            id: "M02-G02-M004",
            name: "Sales Returns",
            color: "#eab308",
            icon: "Refresh",
            order: 4,
            link: "/sales/returns",
            desc: "Handle customer return requests",
          },
        ],
      },
    ],
  },
  {
    id: "M03",
    name: "Purchase",
    icon: "Purchase",
    color: "#06b6d4",
    order: 3,
    groups: [
      {
        id: "G01",
        name: "Setup",
        order: 1,
        menus: [
          {
            id: "M03-G01-M001",
            name: "Purchase Bundles",
            color: "#06b6d4",
            icon: "Truck",
            order: 1,
            link: "/purchase/setup/purchase-bundles",
            desc: "Manage bundle purchase",
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
            name: "MRR (Direct)",
            color: "#06b6d4",
            icon: "Package",
            order: 1,
            link: "/purchase/mrr-direct",
            desc: "Record received goods and inspections",
          },
          {
            id: "M03-G02-M002",
            name: "Purchase Returns",
            color: "#06b6d4",
            icon: "Refresh",
            order: 2,
            link: "/purchase/returns",
            desc: "Handle suppliers return requests",
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
            name: "Items",
            color: "#f97316",
            icon: "Box",
            order: 1,
            link: "/inventory/setup/items",
            desc: "Manage inventory item records",
          },
          {
            id: "M04-G01-M002",
            name: "Item Bundles",
            color: "#f97316",
            icon: "Box",
            order: 2,
            link: "/inventory/setup/items-price-bundle",
            desc: "Manage inventory item price bundles records",
          },
          {
            id: "M04-G01-M003",
            name: "Categories",
            color: "#f97316",
            icon: "Box",
            order: 3,
            link: "/inventory/setup/categories",
            desc: "Organize product categories",
          },
          {
            id: "M04-G01-M004",
            name: "Brands",
            color: "#f97316",
            icon: "Box",
            order: 4,
            link: "/inventory/setup/brands",
            desc: "Manage product brand profiles",
          },
          {
            id: "M04-G01-M005",
            name: "Groups",
            color: "#f97316",
            icon: "Box",
            order: 5,
            link: "/inventory/setup/groups",
            desc: "Manage product group classifications",
          },
          {
            id: "M04-G01-M006",
            name: "Units",
            color: "#f97316",
            icon: "Box",
            order: 6,
            link: "/inventory/setup/units",
            desc: "Configure measurement units",
          },
        ],
      },
      {
        id: "G02",
        name: "Transactions",
        order: 2,
        menus: [
          {
            id: "M04-G02-M001",
            name: "Inventory Stock Adjustment",
            color: "#f97316",
            icon: "Package",
            order: 1,
            link: "/inventory/adjustment-stock",
            desc: "Manage inventory stock adjustment records",
          },
        ],
      },
      {
        id: "G03",
        name: "Reports",
        order: 3,
        menus: [
          {
            id: "M04-G03-M001",
            name: "Stock",
            color: "#f97316",
            icon: "Box",
            order: 1,
            link: "/inventory/stock",
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
            name: "BOM",
            color: "#22c55e",
            icon: "Manufacture",
            order: 1,
            link: "/manufacturing/setup/bom",
            desc: "Bill of Materials structure",
          },
          {
            id: "M05-G01-M002",
            name: "Productions",
            color: "#22c55e",
            icon: "Manufacture",
            order: 2,
            link: "/manufacturing/setup/productions",
            desc: "Track and manage manufacturing runs",
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
            order: 1,
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
        name: "Setup",
        order: 1,
        menus: [
          {
            id: "M06-G01-M001",
            name: "District / Zone",
            color: "#3b82f6",
            icon: "Map",
            order: 1,
            link: "/crm/setup/district-zones",
            desc: "Configure district and zone regions",
          },
          {
            id: "M06-G01-M002",
            name: "Thana / Area",
            color: "#3b82f6",
            icon: "Location",
            order: 2,
            link: "/crm/setup/thana-areas",
            desc: "Manage thana and area zones",
          },
          {
            id: "M06-G01-M003",
            name: "Territories",
            color: "#3b82f6",
            icon: "Location",
            order: 3,
            link: "/crm/setup/territories",
            desc: "Define sales territory boundaries",
          },
        ],
      },
      {
        id: "G02",
        name: "Contacts",
        order: 2,
        menus: [
          {
            id: "M06-G02-M001",
            name: "Contacts",
            color: "#3b82f6",
            icon: "Users",
            order: 1,
            link: "/M06/contacts",
            desc: "Manage business contact records",
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
            icon: "Clock",
            order: 1,
            link: "/hrms/setup/work-shifts",
            desc: "Set employee work shift schedules",
          },
          {
            id: "M07-G01-M002",
            name: "Designations",
            color: "#ec4899",
            icon: "User",
            order: 2,
            link: "/hrms/setup/designations",
            desc: "Manage designations",
          },
          {
            id: "M07-G01-M003",
            name: "Holidays",
            color: "#ec4899",
            icon: "Calendar",
            order: 3,
            link: "/hrms/setup/holidays",
            desc: "Manage holiday calendar entries",
          },
          {
            id: "M07-G01-M004",
            name: "Employees",
            color: "#ec4899",
            icon: "Users",
            order: 4,
            link: "/M07/employees",
            desc: "Manage employees",
          },
        ],
      },
      {
        id: "G02",
        name: "Operations",
        order: 2,
        menus: [
          {
            id: "M07-G02-M001",
            name: "Attend Logs",
            color: "#ec4899",
            icon: "Clock",
            order: 1,
            link: "/M07/attend-logs",
            desc: "View employee attendance logs",
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
            name: "Party Accounts",
            color: "#8b5cf6",
            icon: "Users",
            order: 2,
            link: "/accounts/setup/parties",
            desc: "Manage party account profiles",
          },
          {
            id: "M08-G01-M003",
            name: "Accounting Periods",
            color: "#8b5cf6",
            icon: "Calendar",
            order: 3,
            link: "/accounts/setup/accounting-periods",
            desc: "Set accounting period date ranges",
          },
          {
            id: "M08-G01-M004",
            name: "Fiscal Years",
            color: "#8b5cf6",
            icon: "Calendar",
            order: 4,
            link: "/accounts/setup/fiscal-years",
            desc: "Manage fiscal year periods",
          },
          {
            id: "M08-G01-M005",
            name: "Chart of Accounts Network",
            color: "#8b5cf6",
            icon: "Share",
            order: 5,
            link: "/accounts/setup/coa-network",
            desc: "Chart of accounts network",
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
            icon: "Activity",
            order: 1,
            link: "/accounts/journals",
            desc: "Record financial journal entries",
          },
          {
            id: "M08-G02-M002",
            name: "Receivables",
            color: "#8b5cf6",
            icon: "Activity",
            order: 2,
            link: "/accounts/receivables",
            desc: "Record Receivables journal entries",
          },
          {
            id: "M08-G02-M003",
            name: "Payables",
            color: "#8b5cf6",
            icon: "Activity",
            order: 3,
            link: "/accounts/payables",
            desc: "Record Payables journal entries",
          },
          {
            id: "M08-G02-M004",
            name: "Payables (Local)",
            color: "#8b5cf6",
            icon: "Activity",
            order: 4,
            link: "/accounts/payables-local",
            desc: "Record Receivables journal entries",
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
            icon: "Chart",
            order: 1,
            link: "/accounts/reports/fstatements",
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
        name: "Setup",
        order: 1,
        menus: [
          {
            id: "M09-G01-M001",
            name: "Settings",
            color: "#f59e0b",
            icon: "Settings",
            order: 1,
            link: "/settings",
            desc: "Configure system preferences",
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
            icon: "Activity",
            order: 1,
            link: "/transactions",
            desc: "Browse all system transactions",
          },
        ],
      },
      {
        id: "G03",
        name: "Reports",
        order: 3,
        menus: [
          {
            id: "M09-G03-M001",
            name: "Reports",
            color: "#f59e0b",
            icon: "Chart",
            order: 1,
            link: "/reports",
            desc: "View and generate system reports",
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
            icon: "Cogs",
            order: 1,
            link: "/examples",
            desc: "Browse UI component examples",
          },
          {
            id: "M09-G04-M002",
            name: "TreeView Examples",
            color: "#22c55e",
            icon: "Tree",
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
            icon: "Dashboard",
            order: 1,
            link: "/bsuite/modules",
            desc: "Browse all application modules",
          },
        ],
      },
    ],
  },
];

/* ─── Permission-based filtering ────────────────────────────────────────────
 *
 * userMenusList is the API array, e.g.
 *   [{ menup_menus: "M01-G02-M001", menup_extpr: false, ... }, ...]
 *
 * When the list is null/undefined/empty all menus are shown (dev fallback).
 * ─────────────────────────────────────────────────────────────────────────── */

/**
 * Filter a module list down to only the menus the user is permitted to see.
 * Permission flags are merged onto each returned menu object.
 * Groups with no visible menus and modules with no visible groups are omitted.
 *
 * @param {Array} modulesList - Source module array (usually rawAppModules)
 * @param {Array|null} userMenusList - Permissions from API / localStorage
 * @returns {Array} Filtered module array (new objects, rawAppModules not mutated)
 */
export const filterAppModules = (modulesList, userMenusList) => {
  // No permissions list → return all modules unfiltered (dev / unauthenticated)
  if (!Array.isArray(userMenusList) || userMenusList.length === 0) {
    return modulesList;
  }

  // Build a quick look-up: menuId → permission object
  const permMap = {};
  for (const p of userMenusList) {
    if (p?.menup_menus) permMap[p.menup_menus] = p;
  }

  const filtered = [];
  for (const mod of modulesList) {
    // M00 (Recent) has no groups – always keep it
    if (!mod.groups) {
      filtered.push({ ...mod });
      continue;
    }

    const filteredGroups = [];
    for (const g of mod.groups) {
      const filteredMenus = g.menus
        .filter((m) => permMap[m.id] !== undefined)
        .map((m) => ({
          ...m,
          // Attach permission flags directly onto the menu object
          menup_extpr: permMap[m.id].menup_extpr,
          menup_addpr: permMap[m.id].menup_addpr,
          menup_edtpr: permMap[m.id].menup_edtpr,
          menup_delpr: permMap[m.id].menup_delpr,
        }));

      if (filteredMenus.length > 0) {
        filteredGroups.push({ ...g, menus: filteredMenus });
      }
    }

    if (filteredGroups.length > 0) {
      filtered.push({ ...mod, groups: filteredGroups });
    }
  }

  return filtered;
};

/**
 * Build the flat menus array used for search & recent menus.
 * Accepts any filtered (or unfiltered) module list.
 *
 * @param {Array} modulesList
 * @returns {Array} Flat array of menu items
 */
export const buildFlatMenus = (modulesList) =>
  modulesList.flatMap((mod) => {
    const items = [];
    if (mod.groups) {
      for (const g of mod.groups) {
        for (const m of g.menus) {
          items.push({
            ...toMenu(m),
            // Carry permission flags through to the flat list
            menup_extpr: m.menup_extpr,
            menup_addpr: m.menup_addpr,
            menup_edtpr: m.menup_edtpr,
            menup_delpr: m.menup_delpr,
            menus_mgrup: g.name,
            menus_mgrup_id: g.id,
            menus_mgrup_order: g.order,
          });
        }
      }
    }
    return items;
  });

/* ─── Live mutable exports ───────────────────────────────────────────────────
 *
 * Components that import `appModules` or `menus` directly get these arrays.
 * `updateAppModules` splices them in-place so existing imports stay in sync
 * without a page reload when the user logs in / out.
 * ─────────────────────────────────────────────────────────────────────────── */

// Initialise from localStorage so a page refresh keeps the filtered view
const _storedMenus = getStorageData()?.menus;
const _initialModules = filterAppModules(rawAppModules, _storedMenus);

export const appModules = _initialModules;
export const menus = buildFlatMenus(_initialModules);

/**
 * Call this whenever userMenus changes (login / logout / session restore) to
 * update the mutable `appModules` and `menus` exports in-place.
 *
 * @param {Array|null} userMenusList - New permissions array (null = show all)
 */
export const updateAppModules = (userMenusList) => {
  const filtered = filterAppModules(rawAppModules, userMenusList);
  const flat = buildFlatMenus(filtered);

  // Replace `appModules` array contents in-place
  appModules.splice(0, appModules.length, ...filtered);
  // Replace `menus` array contents in-place
  menus.splice(0, menus.length, ...flat);
};

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
  { to: "/bsuite/modules", label: "Modules", icon: "⊞" },
];

// Menu entry used by the topbar launcher to open the module page (/bsuite/modules)
// as a window — the window renders all modules and menus, and clicking a menu
// navigates to that menu's URL.
export const modulesMenu = {
  ...toMenu({
    id: "M01-MODULES",
    name: "Modules",
    color: "#7c3aed",
    icon: "Dashboard",
    order: 0,
    link: "/bsuite/modules",
    desc: "Browse all application modules",
  }),
  menus_mgrup: "Navigation",
  menus_mgrup_id: "G00",
  menus_mgrup_order: 0,
};
