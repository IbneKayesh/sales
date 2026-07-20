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
} from "@/icons";

const modules = [
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
    id: "M04-M04-M001",
    menus_mname: "Attributes",
    menus_color: "#f97316",
    menus_micon: <IconBox />,
    menus_odrby: 4,
    menus_mlink: "/M04/attributes",
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
    id: "M08-M01-M001",
    menus_mname: "Chart of Accounts",
    menus_color: "#f59e0b",
    menus_micon: <IconAccounts />,
    menus_odrby: 1,
    menus_mlink: "/M08/chart-of-accounts",
    menus_menus: "M08",
  },
  {
    id: "M08-M01-M002",
    menus_mname: "Party Accounts",
    menus_color: "#f59e0b",
    menus_micon: <IconUsers />,
    menus_odrby: 2,
    menus_mlink: "/M08/party-accounts",
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
    id: "M09-M01-M003",
    menus_mname: "Roles",
    menus_color: "#f59e0b",
    menus_micon: <IconFile />,
    menus_odrby: 1,
    menus_mlink: "/roles",
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
  { to: "/M06/contacts", label: "Contacts", icon: "⊕" },
  { to: "/M08/chart-of-accounts", label: "COA", icon: "◐" },
  { to: "/M01/modules", label: "Modules", icon: "⊞" },
];

const ModulePage = () => {
  const navigate = useNavigate();

  return (
    <div className="page-wrap">
      <div className="module-page__header">
        <div>
          <h2 className="module-page__title">Applications</h2>
          <p className="module-page__subtitle">
            {modules.length} applications &middot; {menus.length} features
          </p>
        </div>
      </div>

      <div className="module-page__list">
        {[...modules]
          .sort((a, b) => a.menus_odrby - b.menus_odrby)
          .map((module) => {
            const modMenus = menus.filter(
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
                      <i style={{ fontSize: 18, color: module.menus_color }} />
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
                        onClick={() => navigate(menu.menus_mlink)}
                        title={menu.menus_mname}
                      >
                        <div
                          className="module-page__menu-icon"
                          style={{ background: `${menu.menus_color}18` }}
                        >
                          {menu.menus_micon}
                          <i
                            className={menu.menus_micon}
                            style={{ fontSize: 20, color: menu.menus_color }}
                          />
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
