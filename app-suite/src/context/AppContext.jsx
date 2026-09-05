import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { apiLogin } from "@/utils/api";
import {
  clearStorageData,
  getStorageData,
  getStorageLoginData,
  setStorageLoginData,
} from "@/utils/storage";
import {
  DEFAULT_FONT,
  DEFAULT_THEME,
  generateThemeShades,
  getRainColor,
  isValidFont,
  isValidHexColor,
  isValidTheme,
  THEME_COLORS,
} from "@/utils/theme";
// Built-in default Workspace wallpaper (bundled with the app). Used when the
// user hasn't set a Workspace image or Page background image.
import defaultWorkspaceBg from "@/assets/wallpapers/aurora.png";
import { resolveMenuIcon } from "@/icons";
import { toast } from "@/components/ToastBox";

const AppContext = createContext(null);

const initialUsers = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    role: "admin",
    status: "active",
    phone: "+1-555-0101",
    department: "engineering",
    createdAt: "2025-01-15",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    role: "editor",
    status: "active",
    phone: "+1-555-0102",
    department: "design",
    createdAt: "2025-02-03",
  },
  {
    id: 3,
    name: "Carol White",
    email: "carol@example.com",
    role: "viewer",
    status: "pending",
    phone: "+1-555-0103",
    department: "marketing",
    createdAt: "2025-02-20",
  },
  {
    id: 4,
    name: "David Brown",
    email: "david@example.com",
    role: "contributor",
    status: "inactive",
    phone: "+1-555-0104",
    department: "sales",
    createdAt: "2025-03-10",
  },
  {
    id: 5,
    name: "Eve Davis",
    email: "eve@example.com",
    role: "editor",
    status: "active",
    phone: "+1-555-0105",
    department: "engineering",
    createdAt: "2025-03-22",
  },
  {
    id: 6,
    name: "Frank Miller",
    email: "frank@example.com",
    role: "viewer",
    status: "archived",
    phone: "+1-555-0106",
    department: "support",
    createdAt: "2025-04-05",
  },
  {
    id: 7,
    name: "Grace Wilson",
    email: "grace@example.com",
    role: "admin",
    status: "active",
    phone: "+1-555-0107",
    department: "hr",
    createdAt: "2025-04-18",
  },
  {
    id: 8,
    name: "Henry Taylor",
    email: "henry@example.com",
    role: "contributor",
    status: "pending",
    phone: "+1-555-0108",
    department: "finance",
    createdAt: "2025-05-01",
  },
  {
    id: 9,
    name: "Ivy Anderson",
    email: "ivy@example.com",
    role: "editor",
    status: "active",
    phone: "+1-555-0109",
    department: "engineering",
    createdAt: "2025-05-14",
  },
  {
    id: 10,
    name: "Jack Thomas",
    email: "jack@example.com",
    role: "viewer",
    status: "active",
    phone: "+1-555-0110",
    department: "operations",
    createdAt: "2025-06-02",
  },
  {
    id: 11,
    name: "Kate Garcia",
    email: "kate@example.com",
    role: "admin",
    status: "inactive",
    phone: "+1-555-0111",
    department: "marketing",
    createdAt: "2025-06-19",
  },
  {
    id: 12,
    name: "Leo Martinez",
    email: "leo@example.com",
    role: "contributor",
    status: "active",
    phone: "+1-555-0112",
    department: "design",
    createdAt: "2025-07-08",
  },
];

const roleDefinitions = [
  {
    value: "admin",
    label: "Admin",
    color: "#ef4444",
    permissions: ["create", "read", "update", "delete", "manage"],
  },
  {
    value: "editor",
    label: "Editor",
    color: "#f59e0b",
    permissions: ["create", "read", "update"],
  },
  {
    value: "contributor",
    label: "Contributor",
    color: "#6366f1",
    permissions: ["create", "read"],
  },
  { value: "viewer", label: "Viewer", color: "#6b7280", permissions: ["read"] },
];

const initialTransactions = [
  {
    id: 1,
    date: "2025-07-01",
    description: "Software License - Adobe Creative Cloud",
    category: "software",
    amount: 599.99,
    type: "expense",
    status: "completed",
    userId: 1,
  },
  {
    id: 2,
    date: "2025-07-02",
    description: "Client Payment - Web Design Project",
    category: "revenue",
    amount: 3500.0,
    type: "income",
    status: "completed",
    userId: 2,
  },
  {
    id: 3,
    date: "2025-07-03",
    description: "Office Supplies - Staples",
    category: "office",
    amount: 234.5,
    type: "expense",
    status: "completed",
    userId: 3,
  },
  {
    id: 4,
    date: "2025-07-05",
    description: "Electricity Bill - July",
    category: "utilities",
    amount: 890.0,
    type: "expense",
    status: "pending",
    userId: 1,
  },
  {
    id: 5,
    date: "2025-07-07",
    description: "Consulting Income - Q3 Strategy",
    category: "revenue",
    amount: 5000.0,
    type: "income",
    status: "completed",
    userId: 4,
  },
  {
    id: 6,
    date: "2025-07-08",
    description: "Employee Salaries - July",
    category: "payroll",
    amount: 12500.0,
    type: "expense",
    status: "completed",
    userId: 1,
  },
  {
    id: 7,
    date: "2025-07-10",
    description: "Google Ads Campaign",
    category: "marketing",
    amount: 1500.0,
    type: "expense",
    status: "failed",
    userId: 5,
  },
  {
    id: 8,
    date: "2025-07-12",
    description: "AWS Hosting - Monthly",
    category: "software",
    amount: 847.32,
    type: "expense",
    status: "completed",
    userId: 2,
  },
  {
    id: 9,
    date: "2025-07-14",
    description: "Invoice #1024 - ABC Corp",
    category: "revenue",
    amount: 7200.0,
    type: "income",
    status: "pending",
    userId: 3,
  },
  {
    id: 10,
    date: "2025-07-15",
    description: "Team Lunch - Client Meeting",
    category: "travel",
    amount: 185.6,
    type: "expense",
    status: "completed",
    userId: 6,
  },
  {
    id: 11,
    date: "2025-07-17",
    description: "Server Equipment Lease",
    category: "software",
    amount: 2200.0,
    type: "expense",
    status: "refunded",
    userId: 1,
  },
  {
    id: 12,
    date: "2025-07-18",
    description: "Freelance Payment - UI Design",
    category: "revenue",
    amount: 1800.0,
    type: "income",
    status: "completed",
    userId: 7,
  },
  {
    id: 13,
    date: "2025-07-20",
    description: "Water Bill - Office",
    category: "utilities",
    amount: 320.0,
    type: "expense",
    status: "pending",
    userId: 4,
  },
  {
    id: 14,
    date: "2025-07-21",
    description: "LinkedIn Premium Recruiting",
    category: "marketing",
    amount: 79.99,
    type: "expense",
    status: "completed",
    userId: 8,
  },
  {
    id: 15,
    date: "2025-07-22",
    description: "Retainer - Digital Ocean",
    category: "software",
    amount: 120.0,
    type: "expense",
    status: "completed",
    userId: 2,
  },
];

const categoryOptions = [
  { value: "revenue", label: "Revenue", type: "income" },
  { value: "software", label: "Software & SaaS", type: "expense" },
  { value: "office", label: "Office Supplies", type: "expense" },
  { value: "utilities", label: "Utilities", type: "expense" },
  { value: "payroll", label: "Payroll", type: "expense" },
  { value: "marketing", label: "Marketing", type: "expense" },
  { value: "travel", label: "Travel", type: "expense" },
  { value: "misc", label: "Miscellaneous", type: "expense" },
];

// Minimized (hidden) windows are persisted so they survive a page reload and
// reappear in the taskbar strip. The menu icon is a React element, so only the
// icon name is stored and re-resolved on restore.
const POPUPS_STORAGE_KEY = "bsuite_minimized_popups";

// Starred favorite menus — shared between the Modules page Pinned section and
// the taskbar quick-launch shortcuts. Kept in context so pinning/unpinning in
// one place updates the other immediately.
const PINNED_MENUS_STORAGE_KEY = "bsuite_pinned_menus";

// New windows are keyed by an incrementing sequence; start high so fresh windows
// never collide with the small sequence numbers of restored (persisted) windows.
const START_POPUP_SEQ = 1_000_000_000;

const serializePopup = (p) => ({
  key: p.key,
  hidden: true,
  menu: {
    id: p.menu.id,
    menus_mname: p.menu.menus_mname,
    menus_color: p.menu.menus_color,
    menus_micon_name: p.menu.menus_micon_name,
    menus_odrby: p.menu.menus_odrby,
    menus_mlink: p.menu.menus_mlink,
    menus_mdesc: p.menu.menus_mdesc,
  },
});

const restoreMinimizedPopups = () => {
  try {
    const stored = localStorage.getItem(POPUPS_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((p) => p && p.menu && p.menu.menus_mlink)
      .map((p) => ({
        key: p.key,
        hidden: true,
        menu: {
          id: p.menu.id,
          menus_mname: p.menu.menus_mname,
          menus_color: p.menu.menus_color,
          menus_micon: resolveMenuIcon(p.menu.menus_micon_name),
          menus_odrby: p.menu.menus_odrby,
          menus_mlink: p.menu.menus_mlink,
          menus_mdesc: p.menu.menus_mdesc,
        },
      }));
  } catch (e) {
    return [];
  }
};

export function AppProvider({ children }) {
  const navigate = useNavigate();
  //auth guard or session holder
  const [emply, setEmply] = useState(null);
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [userMenus, setUserMenus] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [theme, setTheme] = useState("light");
  const [themeColor, setThemeColorState] = useState(() => {
    const stored = getStorageLoginData()?.theme;
    if (
      stored === "custom" &&
      isValidHexColor(getStorageLoginData()?.customColor)
    ) {
      return "custom";
    }
    return isValidTheme(stored) ? stored : DEFAULT_THEME;
  });
  // Dark mode: "auto" follows the OS preference, "dark"/"light" force it.
  const [darkMode, setDarkModeState] = useState(() => {
    const stored = getStorageLoginData()?.darkMode;
    return stored === "dark" || stored === "light" || stored === "auto"
      ? stored
      : "light";
  });
  // Application-wide font: "inter" (default) or "sfpro".
  const [font, setFontState] = useState(() => {
    const stored = getStorageLoginData()?.font;
    return isValidFont(stored) ? stored : DEFAULT_FONT;
  });
  // Base text-size scale in px (12–18, default 14). Applied as a multiplier
  // over the whole type scale via the --fs-scale custom property.
  const [fontSize, setFontSizeState] = useState(() => {
    const stored = Number(getStorageLoginData()?.fontSize);
    return Number.isFinite(stored) && stored >= 12 && stored <= 18
      ? stored
      : 14;
  });
  // Spacing density in percent (50–150, default 75). Applied as a
  // multiplier over the --sp-* tokens via the --sp-scale custom property
  // (lower = tighter/compact, higher = more spacious).
  const [density, setDensityState] = useState(() => {
    const stored = getStorageLoginData()?.density;
    // Migrate the old preset strings: compact → 80%, comfortable → 100%.
    if (stored === "compact") return 80;
    if (stored === "comfortable") return 100;
    const n = Number(stored);
    return Number.isFinite(n) && n >= 50 && n <= 150 ? n : 75;
  });
  // Component size scale in percent (50–100, default 75). Multiplies the
  // physical dimensions of controls (buttons, inputs, table rows) via the
  // --comp-scale custom property — separate from spacing (density) and text
  // size, so controls can be dense or large on their own.
  const [compSize, setCompSizeState] = useState(() => {
    const stored = Number(getStorageLoginData()?.compSize);
    return Number.isFinite(stored) && stored >= 50 && stored <= 150
      ? stored
      : 100;
  });
  // Corner-radius base value in px (0–20, default 12). The --radius-* tokens
  // are derived from it on <html> so the whole corner scale follows the slider.
  const [radius, setRadiusState] = useState(() => {
    const stored = getStorageLoginData()?.radius;
    // Migrate the old preset strings: crisp → 4px, soft → 8px.
    if (stored === "crisp") return 4;
    if (stored === "soft") return 8;
    const n = Number(stored);
    return Number.isFinite(n) && n >= 0 && n <= 50 ? n : 6;
  });
  // Reduced motion: disables animations/transitions app-wide.
  const [reduceMotion, setReduceMotionState] = useState(() => {
    const stored = getStorageLoginData()?.reduceMotion;
    return stored === "on";
  });
  // Custom accent color (hex); selecting one also switches themeColor to
  // "custom". Null means no custom color is active.
  const [customColor, setCustomColorState] = useState(() => {
    const stored = getStorageLoginData()?.customColor;
    return isValidHexColor(stored) ? stored : null;
  });
  // Background image (URL or data URL) shown on the Workspace page. Null = no
  // image.
  const [bgImage, setBgImageState] = useState(() => {
    const stored = getStorageLoginData()?.bgImage;
    return typeof stored === "string" && stored.trim() ? stored : null;
  });
  // Separate background image for the window title bars. Falls back to the
  // Workspace image when unset, so a single image can cover both.
  const [titlebarBgImage, setTitlebarBgImageState] = useState(() => {
    const stored = getStorageLoginData()?.titlebarBgImage;
    return typeof stored === "string" && stored.trim() ? stored : null;
  });
  // App-wide page background (wallpaper behind the content shell). When unset
  // the layout keeps its default theme color.
  const [pageBgImage, setPageBgImageState] = useState(() => {
    const stored = getStorageLoginData()?.pageBgImage;
    return typeof stored === "string" && stored.trim() ? stored : null;
  });
  // Background image for the top bar. When unset it keeps its default color.
  const [topbarBgImage, setTopbarBgImageState] = useState(() => {
    const stored = getStorageLoginData()?.topbarBgImage;
    return typeof stored === "string" && stored.trim() ? stored : null;
  });
  // Custom app logo (URL or data URL) shown in the top bar instead of the
  // default logo icon. Null = use the built-in logo.
  const [logoImage, setLogoImageState] = useState(() => {
    const stored = getStorageLoginData()?.logoImage;
    return typeof stored === "string" && stored.trim() ? stored : null;
  });
  // Solid-color alternatives to the background images: each target can show a
  // flat color instead of (or behind) its image. Null = no color override.
  const [bgColor, setBgColorState] = useState(() => {
    const stored = getStorageLoginData()?.bgColor;
    return isValidHexColor(stored) ? stored : null;
  });
  const [pageBgColor, setPageBgColorState] = useState(() => {
    const stored = getStorageLoginData()?.pageBgColor;
    return isValidHexColor(stored) ? stored : null;
  });
  const [titlebarBgColor, setTitlebarBgColorState] = useState(() => {
    const stored = getStorageLoginData()?.titlebarBgColor;
    return isValidHexColor(stored) ? stored : null;
  });
  const [topbarBgColor, setTopbarBgColorState] = useState(() => {
    const stored = getStorageLoginData()?.topbarBgColor;
    return isValidHexColor(stored) ? stored : null;
  });
  // App width: "full" (edge-to-edge) or "boxed" (content constrained to a
  // centered max-width, wallpaper stays full-bleed). Default is boxed.
  const [layout, setLayoutState] = useState(() => {
    const stored = getStorageLoginData()?.layout;
    return stored === "full" ? "full" : "boxed";
  });
  // Boxed-layout side gap in px: the empty space left/right of the content
  // column in boxed mode (10–50, default 15). Applied as --boxed-gap.
  const [boxedGap, setBoxedGapState] = useState(() => {
    const stored = Number(getStorageLoginData()?.boxedGap);
    return Number.isFinite(stored) && stored >= 10 && stored <= 50
      ? stored
      : 15;
  });
  // How module menus open when clicked on the Modules page: "link" (navigate
  // in-page), "window" (floating window), or "both" (offer both). Persisted
  // with the other appearance preferences.
  const [menuOpenMode, setMenuOpenModeState] = useState(() => {
    const stored = getStorageLoginData()?.menuOpenMode;
    return stored === "link" || stored === "window" || stored === "both"
      ? stored
      : "both";
  });
  // Background animation for the Workspace page: "none", "rain" (rain on
  // glass), "analog" (analog clock), or "digital" (digital clock). Decorative overlay; independent of the
  // reduceMotion toggle. Rain settings (density %, tint color, opacity %,
  // drop size %) live in bgAnimSettings and only matter while bgAnim === "rain".
  const [bgAnim, setBgAnimState] = useState(() => {
    const stored = getStorageLoginData()?.bgAnim;
    return stored === "rain" || stored === "analog" || stored === "digital" || stored === "none"
      ? stored
      : "rain";
  });
  const [bgAnimScope, setBgAnimScopeState] = useState(() => {
    const stored = getStorageLoginData()?.bgAnimScope;
    return stored === "workspace" || stored === "app" ? stored : "app";
  });
  const [bgAnimMode, setBgAnimModeState] = useState(() => {
    const stored = getStorageLoginData()?.bgAnimMode;
    return stored === "always" ? "always" : "idle";
  });
  const [bgAnimSettings, setBgAnimSettingsState] = useState(() => {
    const stored = getStorageLoginData()?.bgAnimSettings;
    if (stored && typeof stored === "object") {
      return {
        density: Number(stored.density) || 85,
        color: isValidHexColor(stored.color)
          ? stored.color
          : getRainColor(themeColor, customColor),
        opacity: Number(stored.opacity) || 80,
        size: Number(stored.size) || 90,
        speed: Number(stored.speed) || 90,
        idleMin: stored.idleMin !== undefined ? Number(stored.idleMin) : 1,
        wind: stored.wind !== undefined ? Number(stored.wind) : 60,
        gustSpeed: stored.gustSpeed !== undefined ? Number(stored.gustSpeed) : 100,
      };
    }
    return {
      density: 85,
      color: getRainColor(themeColor, customColor),
      opacity: 80,
      size: 90,
      speed: 90,
      idleMin: 1,
      wind: 60,
      gustSpeed: 100,
    };
  });

  const [isIdle, setIsIdle] = useState(false);
  const isIdleRef = useRef(false);

  useEffect(() => {
    isIdleRef.current = isIdle;
  }, [isIdle]);

  useEffect(() => {
    const idleMin = bgAnimSettings?.idleMin !== undefined ? bgAnimSettings.idleMin : 1;
    if (idleMin === 0) {
      setIsIdle(false);
      return;
    }
    const timeoutMs = idleMin * 60 * 1000;
    
    let timerId = null;
    let lastReset = 0;

    const resetTimer = () => {
      const now = Date.now();
      
      if (isIdleRef.current) {
        setIsIdle(false);
      }

      if (!isIdleRef.current && now - lastReset < 200) {
        return;
      }
      
      lastReset = now;
      if (timerId) clearTimeout(timerId);
      timerId = setTimeout(() => {
        setIsIdle(true);
      }, timeoutMs);
    };

    resetTimer();

    const activityEvents = [
      "mousemove",
      "keydown",
      "mousedown",
      "scroll",
      "touchstart",
    ];

    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    return () => {
      if (timerId) clearTimeout(timerId);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [bgAnimSettings?.idleMin]);

  // Derived: whether the background animation (rain, analog, or digital) should render.
  // "always" → always visible, user works through it non-blocking.
  // "idle"   → only visible while the idle timer has fired.
  const showBgAnim =
    bgAnim !== "none" &&
    (bgAnimMode === "always" || (bgAnimMode === "idle" && isIdle));

  const [users, setUsers] = useState(initialUsers);
  const [transactions, setTransactions] = useState(initialTransactions);

  // Menu windows — routes rendered in modal windows at the app root (see
  // layouts/Window). Multiple windows can be open at once. Windows are
  // seeded from localStorage so minimized windows survive a page reload;
  // popupSeqRef starts high to avoid key collisions with restored windows.
  const [popups, setPopups] = useState(restoreMinimizedPopups);
  const popupSeqRef = useRef(START_POPUP_SEQ);

  // Pinned favorite menus (ids). Seeded from localStorage; persisted on change
  // so the Modules page and the taskbar stay in sync.
  const [pinnedMenuIds, setPinnedMenuIds] = useState(() => {
    try {
      const stored = localStorage.getItem(PINNED_MENUS_STORAGE_KEY);
      const ids = stored ? JSON.parse(stored) : [];
      return Array.isArray(ids) ? ids : [];
    } catch (e) {
      return [];
    }
  });

  const togglePinMenu = useCallback((menuId) => {
    setPinnedMenuIds((prev) => {
      const next = prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [menuId, ...prev];
      try {
        localStorage.setItem(PINNED_MENUS_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        /* ignore */
      }
      return next;
    });
  }, []);

  const openPopup = useCallback((menu) => {
    setPopups((prev) => {
      // Only one window per menu: re-opening a menu that is already open
      // restores it (un-minimizes) and brings it to the front instead of
      // stacking a duplicate.
      const existing = prev.find((p) => p.menu?.id === menu.id);
      if (existing) {
        const rest = prev.filter((p) => p.key !== existing.key);
        return [...rest, { ...existing, hidden: false }];
      }
      popupSeqRef.current += 1;
      return [
        ...prev,
        { key: `${menu.id}-${popupSeqRef.current}`, menu, hidden: false },
      ];
    });
  }, []);

  const closePopup = useCallback((key) => {
    setPopups((prev) => prev.filter((p) => p.key !== key));
  }, []);

  // Bring a window to the front of the stack (rendered last = on top).
  const bringPopupToFront = useCallback((key) => {
    setPopups((prev) => {
      const idx = prev.findIndex((p) => p.key === key);
      if (idx < 0 || idx === prev.length - 1) return prev;
      const next = [...prev];
      const [popup] = next.splice(idx, 1);
      next.push(popup);
      return next;
    });
  }, []);

  // Hide (minimize) a single window without removing it from the stack.
  const hidePopup = useCallback((key) => {
    setPopups((prev) =>
      prev.map((p) => (p.key === key ? { ...p, hidden: true } : p)),
    );
  }, []);

  // Restore a minimized window and bring it to the front.
  const restorePopup = useCallback(
    (key) => {
      setPopups((prev) =>
        prev.map((p) => (p.key === key ? { ...p, hidden: false } : p)),
      );
      bringPopupToFront(key);
    },
    [bringPopupToFront],
  );

  // Hide every open window at once (they stay in the stack, minimized).
  const hideAllPopups = useCallback(() => {
    setPopups((prev) => prev.map((p) => ({ ...p, hidden: true })));
  }, []);

  // Restore every minimized window at once (all become visible again).
  const showAllPopups = useCallback(() => {
    setPopups((prev) => prev.map((p) => ({ ...p, hidden: false })));
  }, []);

  // Close every open window at once.
  const closeAllPopups = useCallback(() => {
    setPopups([]);
  }, []);

  // Persist minimized windows to localStorage whenever the window stack changes.
  useEffect(() => {
    try {
      const minimized = popups.filter((p) => p.hidden);
      if (minimized.length === 0) {
        localStorage.removeItem(POPUPS_STORAGE_KEY);
      } else {
        localStorage.setItem(
          POPUPS_STORAGE_KEY,
          JSON.stringify(minimized.map(serializePopup)),
        );
      }
    } catch (e) {
      /* ignore */
    }
  }, [popups]);

  // Apply the selected theme color onto the document root and keep it in sync.
  // A "custom" theme generates its 50–800 shades from the picked accent hex.
  useEffect(() => {
    const root = document.documentElement;
    const themeDef =
      THEME_COLORS.find((t) => t.id === themeColor) || THEME_COLORS[0];
    const shades =
      themeColor === "custom" && isValidHexColor(customColor)
        ? generateThemeShades(customColor)
        : themeDef.shades;
    root.setAttribute("data-theme", themeDef.id);
    Object.entries(shades).forEach(([shade, value]) => {
      root.style.setProperty(`--theme-${shade}`, value);
    });
  }, [themeColor, customColor]);

  const setThemeColor = useCallback((color) => {
    if (!isValidTheme(color) && color !== "custom") return;
    setThemeColorState(color);
    setStorageLoginData({ theme: color });
    // Rain follows the theme: re-tint the droplets to the new theme's light
    // shade (or the custom-color tint when "custom" is active).
    if (color !== "custom") {
      setBgAnimSettingsState((prev) => ({ ...prev, color: getRainColor(color) }));
    }
  }, []);

  // Pick a custom accent color: stores the hex and switches the theme to
  // "custom". Passing null removes the custom color.
  const setCustomColor = useCallback((hex) => {
    const next = isValidHexColor(hex) ? hex : null;
    setCustomColorState(next);
    setStorageLoginData({ customColor: next });
    // Rain follows the custom color too: light tint of the picked hex, or
    // back to the theme's tint when the custom color is removed.
    setBgAnimSettingsState((prev) => ({
      ...prev,
      color: next ? getRainColor("custom", next) : getRainColor(themeColor),
    }));
    if (next) setThemeColor("custom");
  }, [themeColor, setThemeColor]);

  const setFontSize = useCallback((size) => {
    const n = Number(size);
    if (!Number.isFinite(n) || n < 12 || n > 18) return;
    setFontSizeState(n);
    setStorageLoginData({ fontSize: n });
  }, []);

  const setDensity = useCallback((value) => {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 70 || n > 130) return;
    setDensityState(n);
    setStorageLoginData({ density: n });
  }, []);

  const setCompSize = useCallback((value) => {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 50 || n > 100) return;
    setCompSizeState(n);
    setStorageLoginData({ compSize: n });
  }, []);

  const setRadius = useCallback((value) => {
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0 || n > 20) return;
    setRadiusState(n);
    setStorageLoginData({ radius: n });
  }, []);

  const setReduceMotion = useCallback((on) => {
    setReduceMotionState(!!on);
    setStorageLoginData({ reduceMotion: on ? "on" : "off" });
  }, []);

  // Set the background image (URL / data URL). Empty or non-string clears it.
  const setBgImage = useCallback((value) => {
    const next =
      typeof value === "string" && value.trim() ? value.trim() : null;
    setBgImageState(next);
    setStorageLoginData({ bgImage: next });
  }, []);

  // Set the window title bar image. Empty or non-string clears it.
  const setTitlebarBgImage = useCallback((value) => {
    const next =
      typeof value === "string" && value.trim() ? value.trim() : null;
    setTitlebarBgImageState(next);
    setStorageLoginData({ titlebarBgImage: next });
  }, []);

  // Set the app-wide page background image. Empty or non-string clears it.
  const setPageBgImage = useCallback((value) => {
    const next =
      typeof value === "string" && value.trim() ? value.trim() : null;
    setPageBgImageState(next);
    setStorageLoginData({ pageBgImage: next });
  }, []);

  // Set the top bar background image. Empty or non-string clears it.
  const setTopbarBgImage = useCallback((value) => {
    const next =
      typeof value === "string" && value.trim() ? value.trim() : null;
    setTopbarBgImageState(next);
    setStorageLoginData({ topbarBgImage: next });
  }, []);

  // Set the custom app logo. Empty or non-string clears it.
  const setLogoImage = useCallback((value) => {
    const next =
      typeof value === "string" && value.trim() ? value.trim() : null;
    setLogoImageState(next);
    setStorageLoginData({ logoImage: next });
  }, []);

  // Solid color for a background target; invalid/empty clears it.
  const setBgColor = useCallback((value) => {
    const next = isValidHexColor(value) ? value.toLowerCase() : null;
    setBgColorState(next);
    setStorageLoginData({ bgColor: next });
  }, []);
  const setPageBgColor = useCallback((value) => {
    const next = isValidHexColor(value) ? value.toLowerCase() : null;
    setPageBgColorState(next);
    setStorageLoginData({ pageBgColor: next });
  }, []);
  const setTitlebarBgColor = useCallback((value) => {
    const next = isValidHexColor(value) ? value.toLowerCase() : null;
    setTitlebarBgColorState(next);
    setStorageLoginData({ titlebarBgColor: next });
  }, []);
  const setTopbarBgColor = useCallback((value) => {
    const next = isValidHexColor(value) ? value.toLowerCase() : null;
    setTopbarBgColorState(next);
    setStorageLoginData({ topbarBgColor: next });
  }, []);

  // Set the app width: "full" or "boxed".
  const setLayout = useCallback((value) => {
    if (value !== "full" && value !== "boxed") return;
    setLayoutState(value);
    setStorageLoginData({ layout: value });
  }, []);

  // Set the boxed-layout side gap in px.
  const setBoxedGap = useCallback((value) => {
    const next = Math.min(Math.max(Number(value) || 80, 20), 400);
    setBoxedGapState(next);
    setStorageLoginData({ boxedGap: next });
  }, []);

  // Set how module menus open when clicked on the Modules page.
  const setMenuOpenMode = useCallback((mode) => {
    if (!["link", "window", "both"].includes(mode)) return;
    setMenuOpenModeState(mode);
    setStorageLoginData({ menuOpenMode: mode });
  }, []);

  // Set the Workspace background animation: "none", "rain", "analog", or "digital".
  const setBgAnim = useCallback((value) => {
    if (value !== "none" && value !== "rain" && value !== "analog" && value !== "digital") return;
    setBgAnimState(value);
    setStorageLoginData({ bgAnim: value });
  }, []);

  // Set where the background animation applies: "workspace" or "app".
  const setBgAnimScope = useCallback((value) => {
    if (value !== "workspace" && value !== "app") return;
    setBgAnimScopeState(value);
    setStorageLoginData({ bgAnimScope: value });
  }, []);

  // Set the animation trigger mode: "idle" (only when user is idle) or
  // "always" (rains all the time, no blur, non-blocking).
  const setBgAnimMode = useCallback((value) => {
    if (value !== "idle" && value !== "always") return;
    setBgAnimModeState(value);
    setStorageLoginData({ bgAnimMode: value });
  }, []);

  // Update one rain setting (density/color/opacity/size) and persist all of
  // them together.
  const setBgAnimSetting = useCallback((key, value) => {
    setBgAnimSettingsState((prev) => {
      const next = { ...prev, [key]: value };
      setStorageLoginData({ bgAnimSettings: next });
      return next;
    });
  }, []);

  // Apply dark mode: "dark"/"light" force it, "auto" follows the OS and
  // reacts live to preference changes.
  useEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      const isDark =
        darkMode === "dark" ||
        (darkMode === "auto" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      root.setAttribute("data-mode", isDark ? "dark" : "light");
    };
    apply();
    if (darkMode === "auto") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [darkMode]);

  const setDarkMode = useCallback((mode) => {
    if (!["light", "dark", "auto"].includes(mode)) return;
    setDarkModeState(mode);
    setStorageLoginData({ darkMode: mode });
  }, []);

  // Apply the selected font to the document root so the whole app re-renders
  // with the new font family (see the html[data-font] rules in index.css).
  useEffect(() => {
    document.documentElement.setAttribute("data-font", font);
  }, [font]);

  const setFont = useCallback((id) => {
    if (!isValidFont(id)) return;
    setFontState(id);
    setStorageLoginData({ font: id });
  }, []);

  // Scale the whole type scale relative to the 14px base.
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--fs-scale",
      (fontSize / 14).toFixed(4),
    );
  }, [fontSize]);

  // Spacing density: scale the --sp-* tokens (100 = default, 80 ≈ compact).
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sp-scale",
      (density / 100).toFixed(4),
    );
  }, [density]);

  // Component size: scale physical control dimensions (see App.css overrides).
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--comp-scale",
      (compSize / 100).toFixed(4),
    );
  }, [compSize]);

  // Corner radius: derive the --radius-* token scale from the base px value so
  // every corner style follows the slider (small surfaces stay tighter than
  // large ones, preserving the visual hierarchy).
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--radius-sm", `${Math.max(0, radius - 2)}px`);
    root.style.setProperty("--radius-md", `${radius}px`);
    root.style.setProperty("--radius-lg", `${radius + 2}px`);
    root.style.setProperty("--radius-xl", `${radius + 2}px`);
    root.style.setProperty("--radius-2xl", `${radius + 4}px`);
  }, [radius]);

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-motion",
      reduceMotion ? "reduced" : "normal",
    );
  }, [reduceMotion]);

  // Backgrounds: each target can show a solid color (takes precedence over
  // its image) or an image. Applied as CSS custom properties consumed by the
  // Workspace page, the layout shell, window title bars and the top bar. The
  // readability scrims are switched to transparent when a flat color is shown
  // so the picked color isn't washed out.
  useEffect(() => {
    const root = document.documentElement;
    // Workspace: own image, then the Page image; a Workspace color replaces
    // the image entirely. Empty by default so the theme color shows through.
    const img = bgColor ? null : bgImage || pageBgImage;
    root.style.setProperty(
      "--bg-image",
      img ? `url("${img}")` : "none",
    );
    root.style.setProperty("--bg-color", bgColor || "");
    if (bgColor && !bgImage) {
      root.style.setProperty("--bg-scrim", "rgba(0,0,0,0)");
    } else {
      root.style.removeProperty("--bg-scrim");
    }
    // Vivid aurora chrome: while the top/title bars use the bundled aurora
    // (and no solid color overrides it), flip them to a vibrant
    // emerald→cyan→indigo gradient over the aurora with white content — the
    // colorful default look. Any other image keeps the scrimmed treatment.
    const topbarVivid = topbarBgImage === defaultWorkspaceBg && !topbarBgColor;
    const titlebarVivid = titlebarBgImage === defaultWorkspaceBg && !titlebarBgColor;
    root.toggleAttribute("data-topbar-vivid", topbarVivid);
    root.toggleAttribute("data-titlebar-vivid", titlebarVivid);
    // Window title bars: color takes precedence; otherwise the scrimmed image
    // over the default primary tint.
    const titleImg = titlebarBgColor ? null : titlebarBgImage;
    root.style.setProperty(
      "--titlebar-bg",
      titlebarBgColor
        ? titlebarBgColor
        : titleImg
          ? titlebarVivid
            ? `linear-gradient(120deg, rgba(5,150,105,0.78), rgba(6,182,212,0.78), rgba(79,70,229,0.78)), url("${titleImg}") center / cover no-repeat`
            : `linear-gradient(var(--titlebar-scrim, rgba(255,255,255,0.72)), var(--titlebar-scrim, rgba(255,255,255,0.72))), url("${titleImg}") center / cover no-repeat var(--primary-bg)`
          : "var(--primary-bg)",
    );
    // App-wide page background (wallpaper) on the layout shell.
    root.style.setProperty(
      "--page-bg-image",
      pageBgColor ? "none" : pageBgImage ? `url("${pageBgImage}")` : "none",
    );
    root.style.setProperty("--page-bg-color", pageBgColor || "");
    if (pageBgColor) {
      root.style.setProperty("--page-scrim", "rgba(0,0,0,0)");
    } else {
      root.style.removeProperty("--page-scrim");
    }
    // Top bar: color takes precedence; otherwise the scrimmed image, the
    // vivid gradient (aurora default), or the frosted-glass default.
    if (topbarBgColor) {
      root.style.setProperty("--topbar-bg", topbarBgColor);
    } else if (topbarBgImage) {
      root.style.setProperty(
        "--topbar-bg",
        topbarVivid
          ? `linear-gradient(120deg, rgba(5,150,105,0.78), rgba(6,182,212,0.78), rgba(79,70,229,0.78)), url("${topbarBgImage}") center / cover no-repeat`
          : `linear-gradient(var(--titlebar-scrim, rgba(255,255,255,0.72)), var(--titlebar-scrim, rgba(255,255,255,0.72))), url("${topbarBgImage}") center / cover no-repeat var(--header-bg)`,
      );
    } else {
      root.style.removeProperty("--topbar-bg");
    }
  }, [
    bgColor,
    bgImage,
    pageBgColor,
    pageBgImage,
    titlebarBgColor,
    titlebarBgImage,
    topbarBgColor,
    topbarBgImage,
  ]);

  // App width: "full" or "boxed" (see html[data-layout] rules in App.css).
  useEffect(() => {
    document.documentElement.setAttribute("data-layout", layout);
  }, [layout]);

  // Boxed-layout side gap drives --boxed-gap used by the boxed CSS rules.
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--boxed-gap",
      `${boxedGap}px`,
    );
  }, [boxedGap]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  // Listen for unauthorized API responses and redirect to login
  useEffect(() => {
    const handleUnauthorized = () => {
      clearStorageData();
      setUser(null);
      setEmply(null);
      setBusiness(null);
      setUserMenus([]);
      setPopups([]);
      navigate("/auth/login");
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  useEffect(() => {
    const storedEmply = getStorageData()?.emply;
    if (storedEmply) {
      setEmply(storedEmply);
    }
    const storedUser = getStorageData()?.users;
    if (storedUser) {
      setUser(storedUser);
    }
    const storedBusiness = getStorageData()?.bsins;
    if (storedBusiness) {
      setBusiness(storedBusiness);
    }

    const storedMenus = getStorageData()?.menus;
    if (storedMenus) {
      setUserMenus(storedMenus);
    }
  }, []);

  const login = async (fromData) => {
    try {
      const reqBody = {
        users_email: fromData.username,
        users_pswrd: fromData.password,
      };
      const resp = await apiLogin({
        body: reqBody,
      });
      //console.log("resp", resp);
      if (resp.success) {
        setEmply(resp.data.emply);
        setUser(resp.data.users);
        setBusiness(resp.data.bsins);
        setUserMenus(resp.data.menus);
      }
      return resp;
    } catch (error) {
      console.log("error", error);
      return error;
    }
  };

  const logout = useCallback(() => {
    clearStorageData();
    setUser(null);
    setEmply(null);
    setBusiness(null);
    setUserMenus([]);
    setPopups([]);
    navigate("/auth/login");
  }, []);

  const addUser = useCallback((userData) => {
    const newUser = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUsers((prev) => [...prev, newUser]);
    return newUser;
  }, []);

  const updateUser = useCallback((id, data) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
  }, []);

  const deleteUser = useCallback((id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }, []);

  const addTransaction = useCallback((txnData) => {
    const newTxn = {
      ...txnData,
      id: Date.now(),
    };
    setTransactions((prev) => [...prev, newTxn]);
    return newTxn;
  }, []);

  const updateTransaction = useCallback((id, data) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t)),
    );
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        business,
        login,
        logout,
        sidebarOpen,
        toggleSidebar,
        theme,
        setTheme,
        themeColor,
        setThemeColor,
        darkMode,
        setDarkMode,
        font,
        setFont,
        fontSize,
        setFontSize,
        density,
        setDensity,
        compSize,
        setCompSize,
        radius,
        setRadius,
        reduceMotion,
        setReduceMotion,
        customColor,
        setCustomColor,
        bgImage,
        setBgImage,
        titlebarBgImage,
        setTitlebarBgImage,
        pageBgImage,
        setPageBgImage,
        topbarBgImage,
        setTopbarBgImage,
        bgColor,
        setBgColor,
        pageBgColor,
        setPageBgColor,
        titlebarBgColor,
        setTitlebarBgColor,
        topbarBgColor,
        setTopbarBgColor,
        logoImage,
        setLogoImage,
        layout,
        setLayout,
        boxedGap,
        setBoxedGap,
        menuOpenMode,
        setMenuOpenMode,
        bgAnim,
        setBgAnim,
        bgAnimScope,
        setBgAnimScope,
        bgAnimMode,
        setBgAnimMode,
        bgAnimSettings,
        setBgAnimSetting,
        isIdle,
        showBgAnim,
        popups,
        openPopup,
        closePopup,
        hidePopup,
        restorePopup,
        hideAllPopups,
        showAllPopups,
        closeAllPopups,
        bringPopupToFront,
        pinnedMenuIds,
        togglePinMenu,
        users,
        addUser,
        updateUser,
        deleteUser,
        roles: roleDefinitions,
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        categoryOptions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
