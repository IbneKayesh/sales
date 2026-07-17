// ── App Configuration ─────────────────────────────────────────────────────
// Single source of truth for all app/page metadata.
// Use `appConfigById[id]` for O(1) lookups, or iterate `APP_ROUTES`.
// SVG icons live in src/assets/icons/ — import individually or via barrel.
// ──────────────────────────────────────────────────────────────────────────

import { lazy } from 'react';

import { APP_ICONS } from "@/assets/icons";

// ── Page component imports (static + lazy) ──────────────────────────────
import HomePage from "@/pages/HomePage";
import FilesPage from "@/pages/system/FilesPage";
import GalleryPage from "@/pages/system/GalleryPage";
import SettingsPage from "@/pages/system/SettingsPage";
import DocumentsPage from "@/pages/system/DocumentsPage";
import TrashPage from "@/pages/system/TrashPage";
import SalesApp from "@/pages/sales/SalesApp";
import OrdersPage from "@/pages/sales/OrdersPage";
import InvoicePage from "@/pages/sales/InvoicePage";
import DeliveryPage from "@/pages/sales/DeliveryPage";
import ReportsPage from "@/pages/sales/ReportsPage";
import InventoryPage from "@/pages/inventory/InventoryPage";
import ProductsPage from "@/pages/products/ProductsPage";
import PurchasePage from "@/pages/modules/PurchasePage";
import HRPage from "@/pages/modules/HRPage";
import CRMPage from "@/pages/modules/CRMPage";
import ProfilePage from "@/pages/system/ProfilePage";
import NotificationPage from "@/pages/system/NotificationPage";
import ProductionPage from "@/pages/M05/production/ProductionPage";

/**
 * Get an icon component by app id. Returns null if not found.
 */
export const getAppIcon = (id) => {
  if (!(id in APP_ICONS)) {
    if (import.meta.env.DEV) {
      console.warn(
        `[appConfig] No registered icon for app "${id}". ` +
          `Add it to APP_ICONS in src/assets/icons/index.jsx`,
      );
    }
    return null;
  }
  return APP_ICONS[id];
};

// ── Route definitions ─────────────────────────────────────────────────────
export const APP_ROUTES = [
  // ── Dashboard ──────────────────────────────────────────────────────────
  {
    id: "home",
    title: "Home",
    label: "Home",
    url: "/home",
    description: "Dashboard with system overview and widgets.",
    parentId: null,
    category: "dashboard",
    defaultWindow: { width: 800, height: 540, x: 80, y: 60 },
    color: { bg: "rgba(139, 92, 246, 0.15)", color: "#a78bfa" },
    defaultApp: true,
    showInNavBar: true,
    showInDock: true,
    showInLauncher: true,
    showOnDesktop: true,
  },

  // ── System ─────────────────────────────────────────────────────────────
  {
    id: "files",
    title: "Finder",
    label: "Finder",
    url: "/files",
    description: "Manage files, folders, and resources.",
    parentId: null,
    category: "system",
    defaultWindow: { width: 750, height: 480, x: 80, y: 80 },
    color: { bg: "rgba(59, 130, 246, 0.15)", color: "#3b82f6" },
    defaultApp: true,
    showInNavBar: true,
    showInDock: true,
    showInLauncher: true,
    showOnDesktop: true,
  },
  {
    id: "gallery",
    title: "System Gallery",
    label: "Gallery",
    url: "/gallery",
    description: "Browse photos, illustrations, and videos.",
    parentId: null,
    category: "system",
    defaultWindow: { width: 800, height: 500, x: 140, y: 120 },
    color: { bg: "rgba(236, 72, 153, 0.15)", color: "#ec4899" },
    defaultApp: true,
    showInNavBar: true,
    showInDock: true,
    showInLauncher: true,
    showOnDesktop: true,
  },
  {
    id: "settings",
    title: "System Settings",
    label: "Settings",
    url: "/settings",
    description: "Configure desktop environment options.",
    parentId: null,
    category: "system",
    defaultWindow: { width: 680, height: 460, x: 200, y: 60 },
    color: { bg: "rgba(16, 185, 129, 0.15)", color: "#10b981" },
    defaultApp: true,
    showInNavBar: true,
    showInDock: true,
    showInLauncher: true,
    showOnDesktop: true,
  },
  {
    id: "documents",
    title: "Documents",
    label: "Documents",
    url: "/documents",
    description: "Read and check system document files.",
    parentId: null,
    category: "system",
    defaultWindow: { width: 600, height: 400, x: 260, y: 150 },
    color: { bg: "rgba(59, 130, 246, 0.15)", color: "#60a5fa" },
    defaultApp: true,
    showInDock: true,
    showInLauncher: true,
    showOnDesktop: true,
  },
  {
    id: "trash",
    title: "Trash",
    label: "Trash",
    url: "/trash",
    description: "Recover or permanently delete items.",
    parentId: null,
    category: "system",
    defaultWindow: { width: 500, height: 350, x: 320, y: 180 },
    color: { bg: "rgba(239, 68, 68, 0.15)", color: "#ef4444" },
    defaultApp: true,
    showInDock: true,
    showInLauncher: true,
    showOnDesktop: true,
  },

  // ── Sales ──────────────────────────────────────────────────────────────
  {
    id: "sales",
    title: "Sales",
    label: "Sales",
    url: "/sales",
    description: "Overview of sales transactions.",
    parentId: null,
    category: "sales",
    defaultWindow: { width: 860, height: 540, x: 100, y: 60 },
    color: { bg: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" },
    defaultApp: true,
    showInDock: false,
    showInLauncher: true,
    showOnDesktop: true,
    children: [
      "sales.orders",
      "sales.invoices",
      "sales.delivery",
      "sales.reports",
    ],
  },
  {
    id: "sales.orders",
    title: "Orders",
    label: "Orders",
    url: "/sales.orders",
    description: "View and manage customer orders.",
    parentId: "sales",
    category: "sales",
    defaultWindow: { width: 800, height: 500, x: 120, y: 70 },
    color: { bg: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" },
    showInNavBar: false,
    defaultApp: false,
    showInDock: false,
    showInLauncher: true,
    showOnDesktop: false,
  },
  {
    id: "sales.invoices",
    title: "Invoices",
    label: "Invoices",
    url: "/sales.invoices",
    description: "Manage billing and payments.",
    parentId: "sales",
    category: "sales",
    defaultWindow: { width: 800, height: 500, x: 140, y: 80 },
    color: { bg: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" },
    defaultApp: false,
    showInDock: false,
    showInLauncher: true,
    showOnDesktop: false,
  },
  {
    id: "sales.delivery",
    title: "Delivery",
    label: "Delivery",
    url: "/sales.delivery",
    description: "Track shipments and deliveries.",
    parentId: "sales",
    category: "sales",
    defaultWindow: { width: 720, height: 520, x: 160, y: 90 },
    color: { bg: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" },
    defaultApp: false,
    showInDock: false,
    showInLauncher: true,
    showOnDesktop: false,
  },
  {
    id: "sales.reports",
    title: "Reports",
    label: "Reports",
    url: "/sales.reports",
    description: "Sales analytics and performance data.",
    parentId: "sales",
    category: "sales",
    defaultWindow: { width: 740, height: 480, x: 180, y: 100 },
    color: { bg: "rgba(245, 158, 11, 0.12)", color: "#f59e0b" },
    defaultApp: false,
    showInDock: false,
    showInLauncher: true,
    showOnDesktop: false,
  },

  // ── Modules ────────────────────────────────────────────────────────────
  {
    id: "inventory",
    title: "Inventory",
    label: "Inventory",
    url: "/inventory",
    description: "Track products, stock levels, and pricing.",
    parentId: null,
    category: "modules",
    defaultWindow: { width: 800, height: 520, x: 120, y: 60 },
    color: { bg: "rgba(139, 92, 246, 0.15)", color: "#8b5cf6" },
    defaultApp: true,
    showInDock: true,
    showInLauncher: true,
    showOnDesktop: true,
  },
  {
    id: "purchase",
    title: "Purchase",
    label: "Purchase",
    url: "/purchase",
    description: "Manage procurement and vendor orders.",
    parentId: null,
    category: "modules",
    defaultWindow: { width: 800, height: 500, x: 100, y: 80 },
    color: { bg: "rgba(59, 130, 246, 0.15)", color: "#60a5fa" },
    defaultApp: true,
    showInDock: false,
    showInLauncher: true,
    showOnDesktop: true,
  },
  {
    id: "hr",
    title: "HR",
    label: "HR",
    url: "/hr",
    description: "Manage employees and departments.",
    parentId: null,
    category: "modules",
    defaultWindow: { width: 780, height: 480, x: 140, y: 100 },
    color: { bg: "rgba(236, 72, 153, 0.15)", color: "#ec4899" },
    defaultApp: true,
    showInDock: false,
    showInLauncher: true,
    showOnDesktop: true,
  },
  {
    id: "crm",
    title: "CRM",
    label: "CRM",
    url: "/crm",
    description: "Customer relationship management.",
    parentId: null,
    category: "modules",
    defaultWindow: { width: 820, height: 520, x: 180, y: 120 },
    color: { bg: "rgba(16, 185, 129, 0.15)", color: "#34d399" },
    defaultApp: true,
    showInDock: false,
    showInLauncher: true,
    showOnDesktop: true,
  },
  {
    id: "products",
    title: "Products",
    label: "Products",
    url: "/products",
    description: "Manage products informations.",
    parentId: null,
    category: "modules",
    defaultWindow: { width: 950, height: 450, x: 100, y: 60 },
    color: { bg: "rgba(139, 92, 246, 0.15)", color: "#a78bfa" },
    defaultApp: true,
    showInDock: true,
    showInLauncher: true,
    showOnDesktop: true,
  },
  {
    id: "M05-M01-M001",
    title: "Productions",
    label: "Productions",
    url: "/productions",
    description: "Manage production informations.",
    parentId: null,
    category: "modules",
    defaultWindow: { width: 950, height: 550, x: 100, y: 60 },
    color: { bg: "rgba(139, 92, 246, 0.15)", color: "#a78bfa" },
    defaultApp: true,
    showInDock: true,
    showInLauncher: true,
    showOnDesktop: true,
  },

  // ── User ───────────────────────────────────────────────────────────────
  {
    id: "profile",
    title: "Profile Settings",
    label: "Profile Settings",
    url: "/profile",
    description: "Edit your profile and change password.",
    parentId: null,
    category: "user",
    defaultWindow: { width: 720, height: 540, x: 140, y: 80 },
    color: { bg: "rgba(99, 102, 241, 0.15)", color: "#818cf8" },
    defaultApp: false,
    showInDock: false,
    showInLauncher: true,
    showOnDesktop: false,
  },
  {
    id: "notifications",
    title: "Notifications",
    label: "Notifications",
    url: "/notifications",
    description: "View system notifications and alerts.",
    parentId: null,
    category: "user",
    defaultWindow: { width: 700, height: 520, x: 120, y: 70 },
    color: { bg: "rgba(139, 92, 246, 0.15)", color: "#a78bfa" },
    defaultApp: false,
    showInDock: false,
    showInLauncher: true,
    showOnDesktop: false,
  },
];

// ── Lookup helpers ────────────────────────────────────────────────────────
export const appConfigById = Object.fromEntries(
  APP_ROUTES.map((r) => [r.id, r]),
);

/** Get the default apps that show on the desktop initially */
export const getDefaultApps = () =>
  APP_ROUTES.filter((r) => r.defaultApp).map((r) => r.id);

/** Get apps for a specific category */
export const getAppsByCategory = (category) =>
  APP_ROUTES.filter((r) => r.category === category);

/** Get child apps for a parent */
export const getChildApps = (parentId) =>
  APP_ROUTES.filter((r) => r.parentId === parentId);

/** Get apps by parentId (null = top-level) */
export const getTopLevelApps = () =>
  APP_ROUTES.filter((r) => r.parentId === null);

/** Get apps that show in the navbar (compact top bar) */
export const getNavBarApps = () =>
  APP_ROUTES.filter((r) => r.showInNavBar === true);

/** Get apps that show in the dock */
export const getDockApps = () => APP_ROUTES.filter((r) => r.showInDock);

/** Get apps that show in the launcher */
export const getLauncherApps = () => APP_ROUTES.filter((r) => r.showInLauncher);

/** Get apps that show on the desktop */
export const getDesktopApps = () => APP_ROUTES.filter((r) => r.showOnDesktop);

// ═══════════════════════════════════════════════════════════════════════════
// ── Page Component Registry ───────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

/** Map of app ID → JSX element for direct window rendering */
const PAGE_ELEMENTS = {
  home: <HomePage />,
  files: <FilesPage />,
  gallery: <GalleryPage />,
  settings: <SettingsPage />,
  documents: <DocumentsPage />,
  trash: <TrashPage />,
  sales: <SalesApp />,
  "sales.orders": <OrdersPage />,
  "sales.invoices": <InvoicePage />,
  "sales.delivery": <DeliveryPage />,
  "sales.reports": <ReportsPage />,
  inventory: <InventoryPage />,
  products: <ProductsPage />,
  purchase: <PurchasePage />,
  hr: <HRPage />,
  crm: <CRMPage />,
  profile: <ProfilePage />,
  notifications: <NotificationPage />,
  "M05-M01-M001": <ProductionPage />,
};

/**
 * Get the JSX element for a window by app ID. Returns null if not found.
 */
export const getPageElement = (id) => {
  if (import.meta.env.DEV && !(id in PAGE_ELEMENTS)) {
    console.warn(
      `[appConfig] No registered component for window "${id}". ` +
        `Add it to PAGE_ELEMENTS in src/routes/appConfig.jsx`,
    );
  }
  return PAGE_ELEMENTS[id] ?? null;
};

/** Lazy-loaded page components for route-based rendering */
export const LAZY_PAGES = {
  home: lazy(() => import("@/pages/HomePage")),
  files: lazy(() => import("@/pages/system/FilesPage")),
  gallery: lazy(() => import("@/pages/system/GalleryPage")),
  settings: lazy(() => import("@/pages/system/SettingsPage")),
  documents: lazy(() => import("@/pages/system/DocumentsPage")),
  trash: lazy(() => import("@/pages/system/TrashPage")),
  sales: lazy(() => import("@/pages/sales/SalesApp")),
  "sales.orders": lazy(() => import("@/pages/sales/OrdersPage")),
  "sales.invoices": lazy(() => import("@/pages/sales/InvoicePage")),
  "sales.delivery": lazy(() => import("@/pages/sales/DeliveryPage")),
  "sales.reports": lazy(() => import("@/pages/sales/ReportsPage")),
  inventory: lazy(() => import("@/pages/inventory/InventoryPage")),
  products: lazy(() => import("@/pages/products/ProductsPage")),
  purchase: lazy(() => import("@/pages/modules/PurchasePage")),
  hr: lazy(() => import("@/pages/modules/HRPage")),
  crm: lazy(() => import("@/pages/modules/CRMPage")),
  profile: lazy(() => import("@/pages/system/ProfilePage")),
  notifications: lazy(() => import("@/pages/system/NotificationPage")),
  "M05-M01-M001": lazy(() => import("@/pages/M05/production/ProductionPage")),
};
