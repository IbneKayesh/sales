// Theme color definitions for the General settings page.
// Each theme carries a `shades` map (50–800) with explicit hex values so the
// exact Primary / Accent / Light Surface from the design table are applied:
//   50  → light surface (--surface, --header-bg, ...)
//   500 → accent (--secondary)
//   600 → primary (--primary)
// AppContext copies the selected theme's shades onto `--theme-*` custom
// properties on <html>, and index.css maps those onto the brand tokens.
// All Primary / Accent / Light Surface values are unique across themes.

export const DEFAULT_THEME = "emerald";

export const THEME_COLORS = [
  {
    id: "ocean",
    name: "Ocean",
    color: "#2563EB",
    desc: "Professional, fresh",
    shades: {
      50: "#EFF6FF",
      100: "#DBEAFE",
      200: "#BFDBFE",
      300: "#93C5FD",
      400: "#60A5FA",
      500: "#06B6D4",
      600: "#2563EB",
      700: "#1D4ED8",
      800: "#1E40AF",
    },
  },
  {
    id: "teal",
    name: "Teal",
    color: "#0F766E",
    desc: "Calm, modern",
    shades: {
      50: "#F0FDFA",
      100: "#CCFBF1",
      200: "#99F6E4",
      300: "#5EEAD4",
      400: "#2DD4BF",
      500: "#14B8A6",
      600: "#0F766E",
      700: "#115E59",
      800: "#134E4A",
    },
  },
  {
    id: "indigo",
    name: "Indigo",
    color: "#4F46E5",
    desc: "Modern, premium",
    shades: {
      50: "#EEF2FF",
      100: "#E0E7FF",
      200: "#C7D2FE",
      300: "#A5B4FC",
      400: "#818CF8",
      500: "#8B5CF6",
      600: "#4F46E5",
      700: "#4338CA",
      800: "#3730A3",
    },
  },
  {
    id: "emerald",
    name: "Emerald",
    color: "#059669",
    desc: "Positive, natural",
    shades: {
      50: "#ECFDF5",
      100: "#D1FAE5",
      200: "#A7F3D0",
      300: "#6EE7B7",
      400: "#34D399",
      500: "#10B981",
      600: "#059669",
      700: "#047857",
      800: "#065F46",
    },
  },
  {
    id: "sky",
    name: "Sky",
    color: "#0284C7",
    desc: "Light, friendly",
    shades: {
      50: "#F0F9FF",
      100: "#EAF7FF",
      200: "#E0F2FE",
      300: "#BAE6FD",
      400: "#7DD3FC",
      500: "#38BDF8",
      600: "#0284C7",
      700: "#0369A1",
      800: "#075985",
    },
  },
  {
    id: "cobalt",
    name: "Cobalt",
    color: "#1D4ED8",
    desc: "Strong, corporate",
    shades: {
      50: "#EBF1FF",
      100: "#DBEAFE",
      200: "#BFDBFE",
      300: "#93C5FD",
      400: "#60A5FA",
      500: "#3B82F6",
      600: "#1D4ED8",
      700: "#1E40AF",
      800: "#1E3A8A",
    },
  },
  {
    id: "violet",
    name: "Violet",
    color: "#7C3AED",
    desc: "Creative, elegant",
    shades: {
      50: "#F5F3FF",
      100: "#EDE9FE",
      200: "#E4DDFE",
      300: "#DDD6FE",
      400: "#C4B5FD",
      500: "#A78BFA",
      600: "#7C3AED",
      700: "#6D28D9",
      800: "#5B21B6",
    },
  },
  {
    id: "rose",
    name: "Rose",
    color: "#BE123C",
    desc: "Warm, distinctive",
    shades: {
      50: "#FFF1F2",
      100: "#FFE4E6",
      200: "#FECDD3",
      300: "#FDA4AF",
      400: "#FB7185",
      500: "#F43F5E",
      600: "#BE123C",
      700: "#9F1239",
      800: "#881337",
    },
  },
  {
    id: "amber",
    name: "Amber",
    color: "#B45309",
    desc: "Warm, energetic",
    shades: {
      50: "#FFFBEB",
      100: "#FEF3C7",
      200: "#FDE68A",
      300: "#FCD34D",
      400: "#FBBF24",
      500: "#F59E0B",
      600: "#B45309",
      700: "#92400E",
      800: "#78350F",
    },
  },
  {
    id: "coral",
    name: "Coral",
    color: "#C2410C",
    desc: "Friendly, lively",
    shades: {
      50: "#FFF7ED",
      100: "#FFEDD5",
      200: "#FED7AA",
      300: "#FDBA74",
      400: "#FB923C",
      500: "#F97316",
      600: "#C2410C",
      700: "#9A3412",
      800: "#7C2D12",
    },
  },
  {
    id: "ruby",
    name: "Ruby",
    color: "#E11D48",
    desc: "Bold, sophisticated",
    shades: {
      50: "#FFF0F2",
      100: "#FFEDEF",
      200: "#FFE4E6",
      300: "#FECDD3",
      400: "#FDA4AF",
      500: "#FB7185",
      600: "#E11D48",
      700: "#BE123C",
      800: "#9F1239",
    },
  },
  {
    id: "lime",
    name: "Lime",
    color: "#4D7C0F",
    desc: "Fresh, youthful",
    shades: {
      50: "#F7FEE7",
      100: "#ECFCCB",
      200: "#D9F99D",
      300: "#BEF264",
      400: "#A3E635",
      500: "#84CC16",
      600: "#4D7C0F",
      700: "#3F6212",
      800: "#365314",
    },
  },
  {
    id: "fuchsia",
    name: "Fuchsia",
    color: "#A21CAF",
    desc: "Expressive, unique",
    shades: {
      50: "#FDF4FF",
      100: "#FAE8FF",
      200: "#F5D0FE",
      300: "#F0ABFC",
      400: "#E879F9",
      500: "#D946EF",
      600: "#A21CAF",
      700: "#86198F",
      800: "#701A75",
    },
  },
  {
    id: "navy",
    name: "Navy",
    color: "#1E3A5F",
    desc: "Serious, enterprise",
    shades: {
      50: "#EFF4FA",
      100: "#E2EAF5",
      200: "#C3D2E8",
      300: "#9FB4D0",
      400: "#6E8FB8",
      500: "#4A8CE0",
      600: "#1E3A5F",
      700: "#162C4A",
      800: "#102139",
    },
  },
  {
    id: "slate",
    name: "Slate",
    color: "#475569",
    desc: "Minimal, timeless",
    shades: {
      50: "#F1F5F9",
      100: "#E2E8F0",
      200: "#CBD5E1",
      300: "#94A3B8",
      400: "#64748B",
      500: "#0EA5E9",
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
    },
  },
  {
    id: "copper",
    name: "Copper",
    color: "#92400E",
    desc: "Warm, premium",
    shades: {
      50: "#FFF6E5",
      100: "#FEF3C7",
      200: "#FDE68A",
      300: "#FCD34D",
      400: "#FBBF24",
      500: "#D97706",
      600: "#92400E",
      700: "#78350F",
      800: "#451A03",
    },
  },
];

export const isValidTheme = (id) =>
  typeof id === "string" && THEME_COLORS.some((t) => t.id === id);

// Default raindrop tint for a theme: the theme's light 200 shade (a pastel
// that reads as water on any background). For the custom color, a white-mixed
// light version of the picked hex. Falls back to a neutral light blue.
export const getRainColor = (themeId, customColor) => {
  const theme = THEME_COLORS.find((t) => t.id === themeId);
  if (theme?.shades?.[200]) return theme.shades[200];
  if (isValidHexColor(customColor)) {
    const v = parseInt(customColor.replace("#", ""), 16);
    const mix = (c) => Math.round(c * 0.42 + 255 * 0.58);
    const r = mix((v >> 16) & 255);
    const g = mix((v >> 8) & 255);
    const b = mix(v & 255);
    return `#${[r, g, b]
      .map((c) => c.toString(16).padStart(2, "0"))
      .join("")}`;
  }
  return "#dbeafe";
};

// Rain settings defaults derived from the theme: the drop color follows the
// theme tint; density/opacity/size/speed are tuned to a refined, subtle rain
// (lighter than max so the drops read as elegant glass water, not a storm).
export const getRainDefaults = (themeId, customColor) => ({
  color: getRainColor(themeId, customColor),
  density: 85,
  opacity: 80,
  size: 90,
  speed: 90,
});

// Application-wide font options (see the Theme page). The `stack` is applied
// to --font-sans / --font-heading via the `data-font` attribute on <html>,
// which AppContext keeps in sync with the saved preference.
export const DEFAULT_FONT = "sfpro";

export const FONTS = [
  {
    id: "inter",
    name: "Inter",
    desc: "Self-hosted · clean and neutral",
    stack: '"Inter", system-ui, "Segoe UI", Roboto, sans-serif',
  },
  {
    id: "sfpro",
    name: "SF Pro Display / Text",
    desc: "Apple system font · falls back to Segoe UI on Windows",
    stack: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, sans-serif',
  },
];

export const isValidFont = (id) =>
  typeof id === "string" && FONTS.some((f) => f.id === id);

// True for "#rgb" / "#rrggbb" hex colors (case-insensitive).
export const isValidHexColor = (hex) =>
  typeof hex === "string" && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex);

const hexToRgb = (hex) => {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

const mixHex = (hex, target, weight) => {
  const a = hexToRgb(hex);
  const b = hexToRgb(target);
  const mix = (x, y) => Math.round(x + (y - x) * weight);
  const toHex = (v) => v.toString(16).padStart(2, "0");
  return `#${toHex(mix(a.r, b.r, weight))}${toHex(mix(a.g, b.g, weight))}${toHex(
    mix(a.b, b.b, weight),
  )}`;
};

// Build a 50–800 shade scale from a single accent hex so users can pick a
// fully custom theme color. 600 is the accent itself; lower shades lighten
// toward white, higher shades darken toward black (mirrors the preset tables).
export const generateThemeShades = (hex) => ({
  50: mixHex(hex, "#ffffff", 0.9),
  100: mixHex(hex, "#ffffff", 0.8),
  200: mixHex(hex, "#ffffff", 0.65),
  300: mixHex(hex, "#ffffff", 0.5),
  400: mixHex(hex, "#ffffff", 0.3),
  500: mixHex(hex, "#ffffff", 0.15),
  600: hex,
  700: mixHex(hex, "#000000", 0.12),
  800: mixHex(hex, "#000000", 0.25),
});

// Module icon color — every module and menu uses the full theme primary so
// all icons glow with the same intensity. Callers may pass a module id; it
// no longer affects the color.
export const moduleShade = () => "var(--primary)";
