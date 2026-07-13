/**
 * Centralized page import loaders.
 *
 * Single source of truth for async import functions.
 * Both React.lazy (App.jsx) and the preload utility (utils/preload.js)
 * reference these same functions, ensuring the module cache is shared.
 *
 * When you add a new page, define its import here and both lazy-loading
 * and preloading will pick it up automatically.
 */

// ─── Page loader functions ───────────────────────────────────────────
// Each function calls import() — Vite treats each as a separate chunk.

const loaders = {
  Dashboard: () => import('../pages/Dashboard'),
  Sales:     () => import('../pages/Sales'),
  Purchase:  () => import('../pages/Purchase'),
  Inventory: () => import('../pages/Inventory'),
  Login:     () => import('../pages/Login'),
  NotFound:  () => import('../pages/NotFound'),
  OrderDetail:    () => import('../pages/OrderDetail'),
  ProductDetail:  () => import('../pages/ProductDetail'),
  PODetail:       () => import('../pages/PurchaseOrderDetail'),
  // ─── ERP Modules ──────────────────────────────
  Hr:          () => import('../pages/hr/Hr'),
  Accounting:  () => import('../pages/accounting/Accounting'),
  Crm:         () => import('../pages/crm/Crm'),
  Manufacturing: () => import('../pages/manufacturing/Manufacturing'),
  Projects:    () => import('../pages/projects/Projects'),
  SupplyChain: () => import('../pages/supplychain/SupplyChain'),
  Assets:      () => import('../pages/assets/Assets'),
  Settings:    () => import('../pages/settings/Settings'),
  // ─── Sidebar Sub-Pages ──────────────────────────
  NewOrder:    () => import('../pages/sales/NewOrderPage'),
  Returns:     () => import('../pages/sales/ReturnsPage'),
  NewPurchase: () => import('../pages/purchase/NewPurchasePage'),
  Categories:  () => import('../pages/inventory/CategoriesPage'),
  // ─── Demo / Playground ─────────────────────────
  ModalDemo:   () => import('../pages/ModalDemo'),
};

// ─── Path-based lookup (for preload.js) ──────────────────────────────
// Maps route paths to the corresponding loader function so the preloader
// can fetch a chunk by path without knowing which component it maps to.

export const pathToLoader = {
  '/':          loaders.Dashboard,
  '/sales':     loaders.Sales,
  '/purchase':  loaders.Purchase,
  '/inventory': loaders.Inventory,
  '/login':     loaders.Login,
  '/reports':   loaders.Dashboard,
  '/hr':        loaders.Hr,
  '/accounting': loaders.Accounting,
  '/crm':       loaders.Crm,
  '/manufacturing': loaders.Manufacturing,
  '/projects':  loaders.Projects,
  '/supplychain': loaders.SupplyChain,
  '/assets':    loaders.Assets,
  '/settings':  loaders.Settings,
  // ─── Sidebar Sub-Pages ──────────────────────────
  '/sales/create':     loaders.NewOrder,
  '/sales/returns':    loaders.Returns,
  '/purchase/create':  loaders.NewPurchase,
  '/inventory/categories': loaders.Categories,
  '/demo/modals':         loaders.ModalDemo,
};

// ─── Separate named exports (for React.lazy to use directly) ─────────
// Each can be passed directly to lazy() without wrapping in another arrow function.

export const loadDashboard = loaders.Dashboard;
export const loadSales = loaders.Sales;
export const loadPurchase = loaders.Purchase;
export const loadInventory = loaders.Inventory;
export const loadLogin = loaders.Login;
export const loadNotFound = loaders.NotFound;
export const loadOrderDetail = loaders.OrderDetail;
export const loadProductDetail = loaders.ProductDetail;
export const loadPODetail = loaders.PODetail;
export const loadHr = loaders.Hr;
export const loadAccounting = loaders.Accounting;
export const loadCrm = loaders.Crm;
export const loadManufacturing = loaders.Manufacturing;
export const loadProjects = loaders.Projects;
export const loadSupplyChain = loaders.SupplyChain;
export const loadAssets = loaders.Assets;
export const loadSettings = loaders.Settings;
// ─── Sidebar Sub-Pages ──────────────────────────────────
export const loadNewOrder = loaders.NewOrder;
export const loadReturns = loaders.Returns;
export const loadNewPurchase = loaders.NewPurchase;
export const loadCategories = loaders.Categories;
// ─── Demo / Playground ──────────────────────────────────
export const loadModalDemo = loaders.ModalDemo;
