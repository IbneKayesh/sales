// ── App Configuration ─────────────────────────────────────────────────────
// Single source of truth for all app/page metadata.
// Use `appConfigById[id]` for O(1) lookups, or iterate `APP_ROUTES`.
// SVG icons live in src/assets/icons/ — import individually or via barrel.
// ──────────────────────────────────────────────────────────────────────────

import { APP_ICONS } from "@/assets/icons";

/**
 * Get an icon component by app id. Returns null if not found.
 */
export const getAppIcon = (id) => {
  if (!(id in APP_ICONS)) {
    if (import.meta.env.DEV) {
      console.warn(
        `[appConfig] No registered icon for app "${id}". ` +
        `Add it to APP_ICONS in src/assets/icons/index.jsx`
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
    id: 'home',
    title: 'Home',
    label: 'Home',
    url: '/home',
    description: 'Dashboard with system overview and widgets.',
    parentId: null,
    category: 'dashboard',
    defaultWindow: { width: 800, height: 540, x: 80, y: 60 },
    color: { bg: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' },
    defaultApp: true,
    showInNavBar: true,
    showInDock: true,
    showInLauncher: true,
    showOnDesktop: true,
  },

  // ── System ─────────────────────────────────────────────────────────────
  {
    id: 'files',
    title: 'Finder',
    label: 'Finder',
    url: '/files',
    description: 'Manage files, folders, and resources.',
    parentId: null,
    category: 'system',
    defaultWindow: { width: 750, height: 480, x: 80, y: 80 },
    color: { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' },
    defaultApp: true,
    showInNavBar: true,
    showInDock: true,
    showInLauncher: true,
    showOnDesktop: true,
  },
  {
    id: 'gallery',
    title: 'System Gallery',
    label: 'Gallery',
    url: '/gallery',
    description: 'Browse photos, illustrations, and videos.',
    parentId: null,
    category: 'system',
    defaultWindow: { width: 800, height: 500, x: 140, y: 120 },
    color: { bg: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' },
    defaultApp: true,
    showInNavBar: true,
    showInDock: true,
    showInLauncher: true,
    showOnDesktop: true,
  },
  {
    id: 'settings',
    title: 'System Settings',
    label: 'Settings',
    url: '/settings',
    description: 'Configure desktop environment options.',
    parentId: null,
    category: 'system',
    defaultWindow: { width: 680, height: 460, x: 200, y: 60 },
    color: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' },
    defaultApp: true,
    showInNavBar: true,
    showInDock: true,
    showInLauncher: true,
    showOnDesktop: true,
  },
  {
    id: 'documents',
    title: 'Documents',
    label: 'Documents',
    url: '/documents',
    description: 'Read and check system document files.',
    parentId: null,
    category: 'system',
    defaultWindow: { width: 600, height: 400, x: 260, y: 150 },
    color: { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' },
    defaultApp: true,
    showInDock: true,
    showInLauncher: true,
    showOnDesktop: true,
  },
  {
    id: 'trash',
    title: 'Trash',
    label: 'Trash',
    url: '/trash',
    description: 'Recover or permanently delete items.',
    parentId: null,
    category: 'system',
    defaultWindow: { width: 500, height: 350, x: 320, y: 180 },
    color: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' },
    defaultApp: true,
    showInDock: true,
    showInLauncher: true,
    showOnDesktop: true,
  },

  // ── Sales ──────────────────────────────────────────────────────────────
  {
    id: 'sales',
    title: 'Sales',
    label: 'Sales',
    url: '/sales',
    description: 'Overview of sales transactions.',
    parentId: null,
    category: 'sales',
    defaultWindow: { width: 860, height: 540, x: 100, y: 60 },
    color: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' },
    defaultApp: true,
    showInDock: true,
    showInLauncher: true,
    showOnDesktop: true,
    children: ['sales.orders', 'sales.invoices', 'sales.delivery', 'sales.reports'],
  },
  {
    id: 'sales.orders',
    title: 'Orders',
    label: 'Orders',
    url: '/sales.orders',
    description: 'View and manage customer orders.',
    parentId: 'sales',
    category: 'sales',
    defaultWindow: { width: 800, height: 500, x: 120, y: 70 },
    color: { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' },
    showInNavBar: false,
    defaultApp: false,
    showInDock: false,
    showInLauncher: true,
    showOnDesktop: false,
  },
  {
    id: 'sales.invoices',
    title: 'Invoices',
    label: 'Invoices',
    url: '/sales.invoices',
    description: 'Manage billing and payments.',
    parentId: 'sales',
    category: 'sales',
    defaultWindow: { width: 800, height: 500, x: 140, y: 80 },
    color: { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' },
    defaultApp: false,
    showInDock: false,
    showInLauncher: true,
    showOnDesktop: false,
  },
  {
    id: 'sales.delivery',
    title: 'Delivery',
    label: 'Delivery',
    url: '/sales.delivery',
    description: 'Track shipments and deliveries.',
    parentId: 'sales',
    category: 'sales',
    defaultWindow: { width: 720, height: 520, x: 160, y: 90 },
    color: { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' },
    defaultApp: false,
    showInDock: false,
    showInLauncher: true,
    showOnDesktop: false,
  },
  {
    id: 'sales.reports',
    title: 'Reports',
    label: 'Reports',
    url: '/sales.reports',
    description: 'Sales analytics and performance data.',
    parentId: 'sales',
    category: 'sales',
    defaultWindow: { width: 740, height: 480, x: 180, y: 100 },
    color: { bg: 'rgba(245, 158, 11, 0.12)', color: '#f59e0b' },
    defaultApp: false,
    showInDock: false,
    showInLauncher: true,
    showOnDesktop: false,
  },

  // ── Modules ────────────────────────────────────────────────────────────
  {
    id: 'inventory',
    title: 'Inventory',
    label: 'Inventory',
    url: '/inventory',
    description: 'Track products, stock levels, and pricing.',
    parentId: null,
    category: 'modules',
    defaultWindow: { width: 800, height: 520, x: 120, y: 60 },
    color: { bg: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' },
    defaultApp: true,
    showInDock: true,
    showInLauncher: true,
    showOnDesktop: true,
  },
  {
    id: 'purchase',
    title: 'Purchase',
    label: 'Purchase',
    url: '/purchase',
    description: 'Manage procurement and vendor orders.',
    parentId: null,
    category: 'modules',
    defaultWindow: { width: 800, height: 500, x: 100, y: 80 },
    color: { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' },
    defaultApp: true,
    showInDock: true,
    showInLauncher: true,
    showOnDesktop: true,
  },
  {
    id: 'hr',
    title: 'HR',
    label: 'HR',
    url: '/hr',
    description: 'Manage employees and departments.',
    parentId: null,
    category: 'modules',
    defaultWindow: { width: 780, height: 480, x: 140, y: 100 },
    color: { bg: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' },
    defaultApp: true,
    showInDock: true,
    showInLauncher: true,
    showOnDesktop: true,
  },
  {
    id: 'crm',
    title: 'CRM',
    label: 'CRM',
    url: '/crm',
    description: 'Customer relationship management.',
    parentId: null,
    category: 'modules',
    defaultWindow: { width: 820, height: 520, x: 180, y: 120 },
    color: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399' },
    defaultApp: true,
    showInDock: true,
    showInLauncher: true,
    showOnDesktop: true,
  },
  {
    id: 'products',
    title: 'Products',
    label: 'Products',
    url: '/products',
    description: 'Manage product catalog and pricing information.',
    parentId: null,
    category: 'modules',
    defaultWindow: { width: 840, height: 540, x: 100, y: 60 },
    color: { bg: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' },
    defaultApp: true,
    showInDock: true,
    showInLauncher: true,
    showOnDesktop: true,
  },

  // ── User ───────────────────────────────────────────────────────────────
  {
    id: 'profile',
    title: 'Profile Settings',
    label: 'Profile Settings',
    url: '/profile',
    description: 'Edit your profile and change password.',
    parentId: null,
    category: 'user',
    defaultWindow: { width: 720, height: 540, x: 140, y: 80 },
    color: { bg: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' },
    defaultApp: false,
    showInDock: true,
    showInLauncher: true,
    showOnDesktop: false,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    label: 'Notifications',
    url: '/notifications',
    description: 'View system notifications and alerts.',
    parentId: null,
    category: 'user',
    defaultWindow: { width: 700, height: 520, x: 120, y: 70 },
    color: { bg: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa' },
    defaultApp: false,
    showInDock: true,
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
export const getDockApps = () =>
  APP_ROUTES.filter((r) => r.showInDock);

/** Get apps that show in the launcher */
export const getLauncherApps = () =>
  APP_ROUTES.filter((r) => r.showInLauncher);

/** Get apps that show on the desktop */
export const getDesktopApps = () =>
  APP_ROUTES.filter((r) => r.showOnDesktop);
