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
  '/reports':   loaders.Dashboard,  // Same component, different route
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
