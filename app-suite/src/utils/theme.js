// Theme color definitions for the General settings page.
// Each theme carries a `shades` map (50–800) with explicit hex values so the
// exact Primary / Accent / Light Surface from the design table are applied:
//   50  → light surface (--surface, --header-bg, ...)
//   500 → accent (--secondary)
//   600 → primary (--primary)
// AppContext copies the selected theme's shades onto `--theme-*` custom
// properties on <html>, and index.css maps those onto the brand tokens.
// All Primary / Accent / Light Surface values are unique across themes.

export const DEFAULT_THEME = "violet";

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

// Module icon colors — each module gets its own shade of the current theme
// primary, so modules stay visually distinct while the whole app follows the
// active template/theme color.
//
// `moduleShade(id)` takes a menu or module id like "M01-G01-M001" (or "M01")
// and returns a CSS color expression: the theme primary mixed with white at
// that module's percentage (M01 = 100% → full primary, down to 50% for the
// lightest module). Unmatched ids fall back to the plain theme primary.
const MODULE_SHADE_PCT = {
  M01: 100,
  M02: 88,
  M03: 76,
  M04: 66,
  M05: 58,
  M06: 50,
  M07: 62,
  M08: 74,
  M09: 84,
};

export const moduleShade = (id) => {
  const mod = String(id || "").split("-")[0].toUpperCase();
  const pct = MODULE_SHADE_PCT[mod];
  if (!pct) return "var(--primary)";
  return `color-mix(in srgb, var(--primary) ${pct}%, white)`;
};
