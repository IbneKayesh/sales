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
  IconSettings,
  IconPurchase,
  IconSales,
  IconBar,
  IconInfo,
  IconDashboard,
} from "@/icons";

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
  Bar: IconBar,
  Info: IconInfo,
  Dashboard: IconDashboard,
};

/** Resolve an icon component by its name (returns a rendered element). */
export const resolveMenuIcon = (name) => {
  const Icon = iconMap[name];
  return Icon ? <Icon /> : null;
};
