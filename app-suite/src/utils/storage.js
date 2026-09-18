// Single source of truth for app persistence.
//
// Every storage key the app uses is declared here, and every read/write of the
// browser's Web Storage goes through the helpers in this file — components and
// hooks must not call localStorage/sessionStorage directly. Failures (private
// mode, quota, storage disabled) are swallowed so a persistence problem can
// never break rendering.
//
// The keys are split into two groups:
//
//   SESSION_KEYS    Everything the app remembers about the person who is signed
//                   in: their session, the windows they left open, their
//                   favourite and recent menus, the lock screen. Signing out
//                   wipes all of it (clearSessionKeys), so the next person to
//                   sign in on this machine starts with a clean desktop and
//                   none of the previous user's state.
//
//   PREFERENCE_KEYS Everything the app remembers about this browser instead of a
//                   person: look & feel, the remembered login name, table
//                   layout and window positions. These are not tied to an
//                   account, so they are kept when someone signs out —
//                   otherwise every sign-out would reset the theme, fonts and
//                   grid settings the user just chose.
//
// Rule of thumb: if it describes *who is using the app*, it belongs in
// SESSION_KEYS; if it describes *how this browser is set up*, it belongs in
// PREFERENCE_KEYS.
import defaultLogo from "@/assets/logo-bs.png";

// ── Wiped when the user signs out ──────────────────────────────────────────
export const SESSION_KEYS = {
  /** Who is signed in: employee, user, business, token and the menus they may open. */
  session: "eaac02May2026user",
  /** Windows left open or minimized. Cleared on sign-out so nobody inherits the previous user's desktop. */
  openWindows: "bsuite_open_popups",
  /** Older key that held minimized windows only; still read once, then deleted. */
  legacyMinimizedWindows: "bsuite_minimized_popups",
  /** Starred favourite menus, shown on the Modules page and the taskbar. */
  pinnedMenus: "bsuite_pinned_menus",
  /** Recently opened menus, most recent first. */
  //recentMenus: "bsuite_recent_menus",
  /** Whether the lock screen is showing. Lives in sessionStorage — see SESSION_ONLY_KEYS. */
  screenLocked: "eaac_screen_locked",
};

// Session keys that live in sessionStorage (gone when the tab closes) instead of
// localStorage. Add a key here if it is ever moved between the two stores.
const SESSION_ONLY_KEYS = new Set([SESSION_KEYS.screenLocked]);

// ── Kept when the user signs out ───────────────────────────────────────────
export const PREFERENCE_KEYS = {
  /** Look & feel plus the remembered login name: theme, fonts, density, layout, backgrounds, saved_user … */
  config: "eaac02May2026conf",
  /**
   * Saved window positions/sizes. Stored per user id, so the entries for one
   * user are never shown to another — kept so the same user finds their
   * windows where they left them.
   */
  windowGeometry: "bsuite_window_geometry",
  /** Table rows: compact or comfortable — one choice for the whole app. */
  tableDensity: "bsuite_table_density",
  /** Column order/pinning/visibility for one table, keyed by that table's own id. */
  tableLayout: (id) => `bsuite_table_layout_${id}`,
  /** Which rows are expanded in one tree table, keyed by that tree's own id. */
  treeExpanded: (id) => `bsuite_tree_expanded_${id}`,
};

// ── Low-level access ───────────────────────────────────────────────────────
// The only place the Web Storage API is referenced.
const readRaw = (store, key) => {
  try {
    return store.getItem(key);
  } catch {
    return null;
  }
};

const writeRaw = (store, key, value) => {
  try {
    store.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const removeRaw = (store, key) => {
  try {
    store.removeItem(key);
  } catch {
    /* ignore */
  }
};

/** Read and parse a stored JSON value; `fallback` when missing or corrupt. */
export const readStored = (key, fallback = null) => {
  const raw = readRaw(localStorage, key);
  if (raw == null) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

/** JSON-serialize a value into localStorage. Returns false if it could not be written. */
export const writeStored = (key, value) => writeRaw(localStorage, key, JSON.stringify(value));

/** Delete a localStorage key. */
export const removeStored = (key) => removeRaw(localStorage, key);

// sessionStorage twin — survives a refresh, cleared when the tab closes.
export const readSession = (key, fallback = null) => {
  const raw = readRaw(sessionStorage, key);
  if (raw == null) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
};

export const writeSession = (key, value) => writeRaw(sessionStorage, key, JSON.stringify(value));

export const removeSession = (key) => removeRaw(sessionStorage, key);

// ── Sign-out ───────────────────────────────────────────────────────────────
/**
 * Forget everything stored for the signed-in user (all SESSION_KEYS, whether
 * they live in localStorage or sessionStorage). Called on sign-out and when the
 * API answers "unauthorized". PREFERENCE_KEYS are deliberately left alone.
 */
export const clearSessionKeys = () => {
  for (const key of Object.values(SESSION_KEYS)) {
    if (SESSION_ONLY_KEYS.has(key)) removeSession(key);
    else removeStored(key);
  }
};

// ── Session data (the signed-in user's record) ─────────────────────────────
const defaultData = {
  emply: null,
  bsins: null,
  users: null,
  prtnr: null,
  token: null,
  menus: [],
  recent_links: [],
};

const confData = {
  saved_user: null,
  is_saved: false,
  theme: "emerald",
  darkMode: "light",
  font: "sfpro",
  fontSize: 14,
  density: 75,
  compSize: 100,
  radius: 6,
  reduceMotion: false,
  customColor: null,
  // Aesthetic defaults: every background target (Workspace, Title bar, Page
  // background, Top bar) is empty, so the theme colors / frosted surfaces
  // show through. The bundled emerald monogram logo matches the default
  // theme. Wallpapers are opt-in via the Theme page presets.
  bgImage: null,
  titlebarBgImage: null,
  pageBgImage: null,
  topbarBgImage: null,
  bgColor: null,
  pageBgColor: null,
  titlebarBgColor: null,
  topbarBgColor: null,
  logoImage: defaultLogo,
  layout: "boxed",
  boxedGap: 15,
  // How module menus on the Modules page open when clicked: "link" (in-page
  // navigation), "window" (floating window), or "both" (user picks each time).
  menuOpenMode: "both",
  bgAnim: "rain",
  bgAnimScope: "app",
  bgAnimMode: "idle",
  bgAnimSettings: {
    density: 85,
    color: "",
    opacity: 80,
    size: 90,
    speed: 90,
    idleMin: 1,
    wind: 60,
    gustSpeed: 100,
  },
  sidebar: "visible",
};

export const getStorageData = () => ({
  ...defaultData,
  ...(readStored(SESSION_KEYS.session, null) || {}),
});

export const setStorageData = (data) =>
  writeStored(SESSION_KEYS.session, { ...getStorageData(), ...data });

export const getStorageLoginData = () => ({
  ...confData,
  ...(readStored(PREFERENCE_KEYS.config, null) || {}),
});

export const setStorageLoginData = (data) =>
  writeStored(PREFERENCE_KEYS.config, { ...getStorageLoginData(), ...data });
