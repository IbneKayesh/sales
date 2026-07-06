// ── Session storage key (legacy, used by api.js for auth) ──
const SESSION_KEY = "eaac05Jul2026user";

const defaultSession = {
  emply: null,
  bsins: null,
  users: null,
  token: null,
  menus: [],
  recent_links: [],
};

// ── App data keys ──
export const KEYS = {
  CUSTOMERS: "vmart_customers",
  PRODUCTS: "vmart_products",
  ORDERS: "vmart_orders",
  INVOICES: "vmart_invoices",
  CART: "vmart_cart",
  SHOPS: "vmart_shops",
  FAVORITES: "vmart_favorites",
  REVIEWS: "vmart_reviews",
  USERS_REGISTRY: "vmart_users_registry",
};

// ── Session storage (legacy — single-key object for auth data) ──
export function getStorageData() {
  try {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? { ...defaultSession, ...JSON.parse(data) } : { ...defaultSession };
  } catch {
    return { ...defaultSession };
  }
}

export function setStorageData(data) {
  try {
    const currentData = getStorageData();
    const updatedData = { ...currentData, ...data };
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedData));
  } catch {
    // silently fail
  }
}

export function clearStorageData() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    // silently fail
  }
}

// ── Collection storage (flat key-based arrays for app entities) ──
export function load(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function save(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // silently fail
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // silently fail
  }
}
