import {
  ArrowLeftRight,
  BarChart3,
  Braces,
  Landmark,
  LayoutDashboard,
  PiggyBank,
  Wallet,
} from "lucide-react";

export const NAV_SECTIONS = [
  {
    label: "Banking",
    items: [
      {
        id: "dashboard",
        path: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        title: "Dashboard",
        subtitle: "All banks at a glance",
      },
      {
        id: "bank",
        path: "/bank",
        label: "Bank List",
        icon: Landmark,
        title: "Bank List",
        subtitle: "Banks, branches and status",
      },
      {
        id: "accounts",
        path: "/accounts",
        label: "Bank Accounts",
        icon: Wallet,
        title: "Bank Accounts",
        subtitle: "Savings accounts under each bank",
      },
      {
        id: "sub-accounts",
        path: "/sub-accounts",
        label: "DPS & FD",
        icon: PiggyBank,
        title: "DPS & FD Child Accounts",
        subtitle: "Deposit schemes under a bank account",
      },
      {
        id: "transactions",
        path: "/transactions",
        label: "Transactions",
        icon: ArrowLeftRight,
        title: "Transactions",
        subtitle: "Deposits, withdrawals, transfers & charges",
      },
    ],
  },
  {
    label: "Insights",
    items: [
      {
        id: "cash-flow",
        path: "/cash-flow",
        label: "Cash Flow",
        icon: BarChart3,
        title: "Monthly Cash Flow",
        subtitle: "Deposits, profit and withdrawals per bank",
      },
    ],
  },
  {
    label: "Data",
    items: [
      {
        id: "documents",
        path: "/documents",
        label: "JSON Documents",
        icon: Braces,
        title: "JSON Documents",
        subtitle: "Example JSON document CRUD",
      },
    ],
  },
];

export const NAV_ITEMS = NAV_SECTIONS.flatMap((section) => section.items);

export function getNavItem(path) {
  return NAV_ITEMS.find((item) => item.path === path) ?? NAV_ITEMS[0];
}
