/**
 * Module icon colors — each module gets its own shade of the current theme
 * primary, so modules stay visually distinct while the whole app follows the
 * active template/theme color.
 *
 * `moduleShade(id)` takes a menu or module id like "M01-G01-M001" (or "M01")
 * and returns a CSS color expression: the theme primary mixed with white at
 * that module's percentage (M01 = 100% → full primary, down to 50% for the
 * lightest module). Unmatched ids fall back to the plain theme primary.
 */
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
