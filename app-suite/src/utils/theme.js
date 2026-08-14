// Theme color definitions for the General settings page.
// The `shades` map references the color scales already defined in index.css
// (--violet-50 … --violet-950 etc.), so the hex values live in a single place.
// AppContext copies the selected theme's shades onto `--theme-*` custom
// properties on <html>, and index.css maps those onto the brand tokens.

export const DEFAULT_THEME = "violet";

const shadeRef = (color) => ({
  50: `var(--${color}-50)`,
  100: `var(--${color}-100)`,
  200: `var(--${color}-200)`,
  300: `var(--${color}-300)`,
  400: `var(--${color}-400)`,
  500: `var(--${color}-500)`,
  600: `var(--${color}-600)`,
  700: `var(--${color}-700)`,
  800: `var(--${color}-800)`,
});

export const THEME_COLORS = [
  { id: "violet", name: "Violet", color: "#8b5cf6", shades: shadeRef("violet") },
  { id: "indigo", name: "Indigo", color: "#6366f1", shades: shadeRef("indigo") },
  { id: "blue", name: "Blue", color: "#3b82f6", shades: shadeRef("blue") },
  { id: "cyan", name: "Cyan", color: "#06b6d4", shades: shadeRef("cyan") },
  { id: "teal", name: "Teal", color: "#14b8a6", shades: shadeRef("teal") },
  { id: "emerald", name: "Emerald", color: "#10b981", shades: shadeRef("emerald") },
  { id: "green", name: "Green", color: "#22c55e", shades: shadeRef("green") },
  { id: "lime", name: "Lime", color: "#84cc16", shades: shadeRef("lime") },
  { id: "amber", name: "Amber", color: "#f59e0b", shades: shadeRef("amber") },
  { id: "orange", name: "Orange", color: "#f97316", shades: shadeRef("orange") },
  { id: "red", name: "Red", color: "#ef4444", shades: shadeRef("red") },
  { id: "pink", name: "Pink", color: "#ec4899", shades: shadeRef("pink") },
  { id: "fuchsia", name: "Fuchsia", color: "#d946ef", shades: shadeRef("fuchsia") },
  { id: "purple", name: "Purple", color: "#a855f7", shades: shadeRef("purple") },
];

export const isValidTheme = (id) =>
  typeof id === "string" && THEME_COLORS.some((t) => t.id === id);
