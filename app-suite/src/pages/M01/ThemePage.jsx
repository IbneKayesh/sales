import { useState, useEffect, useId } from "react";
import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
  PageCardFooter,
} from "@/components/PageCard";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import {
  IconCheck,
  IconDelete,
  IconExpand,
  IconBox,
  IconImage,
  IconInfo,
  IconPalette,
  IconRefresh,
  IconSettings,
  IconSun,
  IconMoon,
  IconUpload,
} from "@/icons";
import { useApp } from "@/context/AppContext";
import {
  DEFAULT_FONT,
  DEFAULT_THEME,
  FONTS,
  getRainColor,
  THEME_COLORS,
} from "@/utils/theme";
import { toast } from "@/components/ToastBox";
// Bundled wallpaper presets — one-click Workspace backgrounds. Aurora stays a
// static import because AppContext also uses it as the built-in default; the
// other four are lazy-loaded via dynamic import() so they only download when
// this page renders (they'd otherwise bloat the initial bundle).
// Card thumbnails are tiny 320×180 previews; the full-resolution images are
// fetched only when a preset is actually clicked.
import presetAurora from "@/assets/wallpaper-aurora.png";
import logoBs from "@/assets/logo-bs.png";

const WALLPAPER_PRESETS = [
  { id: "aurora", name: "Aurora", desc: "Dark · bundled with app" },
  { id: "forest", name: "Forest", desc: "Dark · misty pines" },
  { id: "night", name: "Night", desc: "Dark · starry sky" },
  { id: "mountains", name: "Mountains", desc: "Dark · dusk peaks" },
  { id: "ocean", name: "Ocean", desc: "Dark · moonlit sea" },
  { id: "sunset", name: "Sunset", desc: "Dark · warm dusk" },
  { id: "midnight", name: "Midnight", desc: "Dark · grid glow" },
  { id: "sky", name: "Sky", desc: "Light · clear day" },
  { id: "emerald", name: "Emerald", desc: "Light · fresh green" },
  { id: "waves", name: "Waves", desc: "Light · calm blue" },
  { id: "winter", name: "Winter", desc: "Light · snowy cabin" },
  { id: "maple", name: "Maple", desc: "Light · autumn leaves" },
  { id: "flowers", name: "Flowers", desc: "Light · flower meadow" },
  { id: "roses", name: "Roses", desc: "Dark · red roses" },
  { id: "redsun", name: "Red sun", desc: "Dark · dramatic dusk" },
  { id: "moon", name: "Full moon", desc: "Dark · moonlit night" },
  { id: "starnight", name: "Star night", desc: "Dark · milky way" },
  { id: "ripple", name: "Ripple", desc: "Dusk · river ripples" },
  { id: "boats", name: "Boats", desc: "Dark · sunset sails" },
  { id: "birds", name: "Birds", desc: "Light · dawn flight" },
  { id: "oceans", name: "Oceans", desc: "Light · turquoise sea" },
  { id: "bluesky", name: "Blue Sky", desc: "Light · blue sky" },
];

// Lazy loaders for the preset-card thumbnails (tiny, code-split by Vite).
const thumbLoaders = {
  forest: () => import("@/assets/wallpaper-forest-thumb.png"),
  sky: () => import("@/assets/wallpaper-sky-thumb.png"),
  mountains: () => import("@/assets/wallpaper-mountains-thumb.png"),
  ocean: () => import("@/assets/wallpaper-ocean-thumb.png"),
  night: () => import("@/assets/wallpaper-night-thumb.png"),
  sunset: () => import("@/assets/wallpaper-sunset-thumb.png"),
  midnight: () => import("@/assets/wallpaper-midnight-thumb.png"),
  emerald: () => import("@/assets/wallpaper-emerald-thumb.png"),
  waves: () => import("@/assets/wallpaper-waves-thumb.png"),
  winter: () => import("@/assets/wallpaper-winter-thumb.png"),
  maple: () => import("@/assets/wallpaper-maple-thumb.png"),
  flowers: () => import("@/assets/wallpaper-flowers-thumb.png"),
  roses: () => import("@/assets/wallpaper-roses-thumb.png"),
  redsun: () => import("@/assets/wallpaper-redsun-thumb.png"),
  moon: () => import("@/assets/wallpaper-moon-thumb.png"),
  starnight: () => import("@/assets/wallpaper-starnight-thumb.png"),
  ripple: () => import("@/assets/wallpaper-ripple-thumb.png"),
  boats: () => import("@/assets/wallpaper-boats-thumb.png"),
  birds: () => import("@/assets/wallpaper-birds-thumb.png"),
  oceans: () => import("@/assets/wallpaper-oceans-thumb.png"),
  bluesky: () => import("@/assets/wallpaper-blue-sky.jpg"),
};

// Full-resolution loaders — fetched only when a preset is clicked.
const fullLoaders = {
  forest: () => import("@/assets/wallpaper-forest.png"),
  sky: () => import("@/assets/wallpaper-sky.png"),
  mountains: () => import("@/assets/wallpaper-mountains.png"),
  ocean: () => import("@/assets/wallpaper-ocean.png"),
  night: () => import("@/assets/wallpaper-night.png"),
  sunset: () => import("@/assets/wallpaper-sunset.png"),
  midnight: () => import("@/assets/wallpaper-midnight.png"),
  emerald: () => import("@/assets/wallpaper-emerald.png"),
  waves: () => import("@/assets/wallpaper-waves.png"),
  winter: () => import("@/assets/wallpaper-winter.png"),
  maple: () => import("@/assets/wallpaper-maple.png"),
  flowers: () => import("@/assets/wallpaper-flowers.png"),
  roses: () => import("@/assets/wallpaper-roses.png"),
  redsun: () => import("@/assets/wallpaper-redsun.png"),
  moon: () => import("@/assets/wallpaper-moon.png"),
  starnight: () => import("@/assets/wallpaper-starnight.png"),
  ripple: () => import("@/assets/wallpaper-ripple.png"),
  boats: () => import("@/assets/wallpaper-boats.png"),
  birds: () => import("@/assets/wallpaper-birds.png"),
  oceans: () => import("@/assets/wallpaper-oceans.png"),
  bluesky: () => import("@/assets/wallpaper-blue-sky.jpg"),
};

const DARK_MODES = [
  { id: "auto", label: "Auto", hint: "Follow the device setting" },
  { id: "light", label: "Light", hint: "Always light" },
  { id: "dark", label: "Dark", hint: "Always dark" },
];

// Reusable background row: preview + URL input + upload + remove, plus an
// optional solid-color picker (colorValue/onColorChange) that replaces the
// image when set.
const BgImageRow = ({
  label,
  value,
  onChange,
  previewStyle,
  hint,
  colorValue,
  onColorChange,
}) => {
  const [input, setInput] = useState(value || "");
  // Per-instance unique id so this row's label always opens this row's file
  // picker, never another row's.
  const uploadId = useId();
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      onChange(url);
      setInput(url);
    };
    reader.readAsDataURL(file);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: 12,
        background: "var(--surface)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: "var(--fs-sm)",
            fontWeight: 600,
            color: "var(--text-secondary)",
          }}
        >
          {label}
        </span>
        {(value || colorValue) && (
          <span
            style={{
              fontSize: "var(--fs-xs)",
              color: "var(--success)",
              whiteSpace: "nowrap",
            }}
          >
            ● Set
          </span>
        )}
      </div>
      <div
        title={`${label} preview`}
        style={{
          width: "100%",
          height: 108,
          flexShrink: 0,
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          ...previewStyle,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.04em",
            color: "var(--text-primary)",
          }}
        >
          {label}
        </span>
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onBlur={() => onChange(input)}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
        placeholder="Paste an image URL…"
        aria-label={`${label} image URL`}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "8px 12px",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border)",
          background: "var(--surface)",
          color: "var(--text-primary)",
          fontSize: "var(--fs-sm)",
          outline: "none",
        }}
      />
      {onColorChange && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: "var(--fs-sm)",
              color: "var(--text-muted)",
              whiteSpace: "nowrap",
            }}
          >
            Color
          </span>
          <label
            title="Pick a solid background color (replaces the image when set)"
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              cursor: "pointer",
              fontSize: "var(--fs-xs)",
              color: "var(--text-secondary)",
              fontWeight: 600,
            }}
          >
            <span
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                border: "1px solid var(--border)",
                background: colorValue || "var(--surface-alt)",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            {colorValue || "None"}
            <input
              type="color"
              value={colorValue || "#ffffff"}
              onChange={(e) => onColorChange(e.target.value)}
              aria-label={`${label} color`}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                cursor: "pointer",
              }}
            />
          </label>
          {colorValue && (
            <Button
              variant="outline"
              size="sm"
              icon={<IconDelete size={14} />}
              onClick={() => onColorChange(null)}
            >
              Clear
            </Button>
          )}
        </div>
      )}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <label
          htmlFor={uploadId}
          title="Upload an image from your device"
          style={{
            flex: 1,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            padding: "7px 14px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text-secondary)",
            fontWeight: 600,
            fontSize: "var(--fs-sm)",
            cursor: "pointer",
            transition: "var(--transition-fast)",
            whiteSpace: "nowrap",
          }}
        >
          <IconUpload size={14} />
          Upload
        </label>
        <input
          id={uploadId}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFile}
        />
        {value && (
          <Button
            variant="outline"
            size="sm"
            icon={<IconDelete size={14} />}
            onClick={() => {
              onChange(null);
              setInput("");
            }}
          >
            Remove
          </Button>
        )}
      </div>
      {hint && (
        <span
          style={{
            fontSize: "var(--fs-xs)",
            color: "var(--text-muted)",
          }}
        >
          {hint}
        </span>
      )}
    </div>
  );
};

// Reusable pill button for the preference pickers below.
const SettingButton = ({ selected, onClick, title, children }) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onClick}
    title={title}
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "7px 14px",
      borderRadius: "var(--radius-md)",
      border: `1px solid ${selected ? "var(--primary)" : "var(--border)"}`,
      background: selected ? "var(--primary-bg)" : "var(--surface)",
      color: selected ? "var(--primary)" : "var(--text-secondary)",
      fontWeight: 600,
      cursor: "pointer",
      transition: "var(--transition-fast)",
    }}
  >
    {children}
  </button>
);

const ThemePage = () => {
  const {
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
    boxedGap,
    setBoxedGap,
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
    bgAnim,
    setBgAnim,
    bgAnimScope,
    setBgAnimScope,
    bgAnimMode,
    setBgAnimMode,
    bgAnimSettings,
    setBgAnimSetting,
  } = useApp();

  const activeTheme =
    themeColor === "custom"
      ? {
          id: "custom",
          name: customColor ? `Custom (${customColor})` : "Custom",
          color: customColor || THEME_COLORS[0].color,
        }
      : THEME_COLORS.find((t) => t.id === themeColor) || THEME_COLORS[0];
  const activeFont = FONTS.find((f) => f.id === font) || FONTS[0];

  // Which background area the wallpaper presets should apply to.
  const [presetTarget, setPresetTarget] = useState("workspace");

  // Preset card thumbnails: Aurora is already in the main bundle (it's the
  // built-in default), the rest are tiny lazy thumbnails fetched on mount.
  const [presetThumbs, setPresetThumbs] = useState({ aurora: presetAurora });
  // Full-resolution URLs, resolved when a preset is clicked.
  const [presetFull, setPresetFull] = useState({ aurora: presetAurora });
  // Which preset is currently fetching its full-resolution image.
  const [loadingPreset, setLoadingPreset] = useState(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        Object.entries(thumbLoaders).map(async ([id, load]) => {
          try {
            const mod = await load();
            return [id, mod.default];
          } catch {
            return [id, null];
          }
        }),
      );
      if (!cancelled) {
        setPresetThumbs((prev) =>
          entries.reduce(
            (acc, [id, url]) => ({ ...acc, [id]: url ?? prev[id] }),
            prev,
          ),
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Apply a wallpaper preset: fetch the full-resolution image (cached after
  // the first click) and set it on the chosen background target.
  const handlePresetClick = async (p, targetSetter, targetLabel) => {
    if (loadingPreset) return;
    let url = presetFull[p.id];
    if (!url) {
      setLoadingPreset(p.id);
      try {
        const mod = await fullLoaders[p.id]();
        url = mod.default;
        setPresetFull((prev) => ({ ...prev, [p.id]: url }));
      } catch {
        setLoadingPreset(null);
        return;
      }
    }
    setLoadingPreset(null);
    targetSetter(url);
    toast.success(`${targetLabel} background set to ${p.name}`);
  };

  const handleSelect = (theme) => {
    setThemeColor(theme.id);
    toast.success(`Theme color set to ${theme.name}`);
  };

  const handleReset = () => {
    setThemeColor(DEFAULT_THEME);
    setDarkMode("light");
    setFont(DEFAULT_FONT);
    setFontSize(14);
    setDensity(90);
    setCompSize(75);
    setRadius(12);
    setLayout("boxed");
    setBoxedGap(30);
    setReduceMotion(false);
    setCustomColor(null);
    setBgImage(null);
    setTitlebarBgImage(null);
    setPageBgImage(null);
    setTopbarBgImage(null);
    setBgColor(null);
    setPageBgColor(null);
    setTitlebarBgColor(null);
    setTopbarBgColor(null);
    setLogoImage(logoBs);
    setBgAnim("rain");
    setBgAnimScope("app");
    setBgAnimMode("idle");
    setBgAnimSetting("idleMin", 5);
    setBgAnimSetting("density", 95);
    setBgAnimSetting("color", getRainColor(DEFAULT_THEME, null));
    setBgAnimSetting("opacity", 80);
    setBgAnimSetting("size", 45);
    setBgAnimSetting("speed", 10);
    toast.success("Preferences reset to default");
  };

  const isDefault =
    themeColor === DEFAULT_THEME &&
    darkMode === "light" &&
    font === DEFAULT_FONT &&
    fontSize === 14 &&
    density === 90 &&
    compSize === 75 &&
    radius === 12 &&
    layout === "boxed" &&
    boxedGap === 30 &&
    !reduceMotion &&
    !customColor &&
    !bgImage &&
    !titlebarBgImage &&
    !pageBgImage &&
    !topbarBgImage &&
    !bgColor &&
    !pageBgColor &&
    !titlebarBgColor &&
    !topbarBgColor &&
    logoImage === logoBs &&
    bgAnim === "rain" &&
    bgAnimScope === "app" &&
    bgAnimMode === "idle" &&
    bgAnimSettings?.idleMin === 5 &&
    bgAnimSettings?.density === 95 &&
    bgAnimSettings?.color === getRainColor(DEFAULT_THEME, null) &&
    bgAnimSettings?.opacity === 80 &&
    bgAnimSettings?.size === 45 &&
    bgAnimSettings?.speed === 10;

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Theme"
            subtitle="Application preferences — choose the theme color used across the app"
          />
          <PageCardActions>
            <Button
              variant="outline"
              size="sm"
              icon={<IconRefresh size={14} />}
              onClick={handleReset}
              disabled={isDefault}
            >
              Reset to default
            </Button>
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          <div className="general-page__grid">
          <PageCard className="general-page__section-card general-page__section-card--full">
            <PageCardHeader>
            <div className="general-page__section-head">
              <Badge variant="info" icon={<IconSettings size={12} />}>
                Theme Color
              </Badge>
              <span className="general-page__section-note">
                Current: {activeTheme.name} · applies instantly and is saved on
                this device
              </span>
            </div>
            </PageCardHeader>
            <PageCardBody>
            <div
              className="general-page__swatches"
              role="radiogroup"
              aria-label="Theme color"
            >
              {THEME_COLORS.map((theme) => {
                const selected = theme.id === themeColor;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    className={`general-page__swatch-btn${
                      selected ? " general-page__swatch-btn--selected" : ""
                    }`}
                    onClick={() => handleSelect(theme)}
                    title={`${theme.name}${theme.desc ? ` — ${theme.desc}` : ""}`}
                  >
                    <span
                      className="general-page__swatch"
                      style={{ backgroundColor: theme.color }}
                    >
                      {selected && <IconCheck size={14} />}
                    </span>
                    <span className="general-page__swatch-name">
                      {theme.name}
                    </span>
                  </button>
                );
              })}
              <button
                type="button"
                role="radio"
                aria-checked={themeColor === "custom"}
                className={`general-page__swatch-btn${
                  themeColor === "custom"
                    ? " general-page__swatch-btn--selected"
                    : ""
                }`}
                title={
                  customColor
                    ? `Custom color — ${customColor}`
                    : "Pick a custom theme color"
                }
                style={{ position: "relative", overflow: "hidden" }}
              >
                <input
                  type="color"
                  value={customColor || activeTheme.color}
                  onChange={(e) => setCustomColor(e.target.value)}
                  aria-label="Pick a custom theme color"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    opacity: 0,
                    cursor: "pointer",
                    border: "none",
                    padding: 0,
                  }}
                />
                <span
                  className="general-page__swatch"
                  style={{ backgroundColor: customColor || activeTheme.color }}
                >
                  {themeColor === "custom" && <IconCheck size={14} />}
                </span>
                <span className="general-page__swatch-name">Custom</span>
              </button>
            </div>
          </PageCardBody>
          </PageCard>

          <PageCard className="general-page__section-card">
            <PageCardHeader>
            <div className="general-page__section-head">
              <Badge variant="info" icon={<IconMoon size={12} />}>
                Appearance
              </Badge>
              <span className="general-page__section-note">
                Current: {darkMode} · saved on this device
              </span>
            </div>
            </PageCardHeader>
            <PageCardBody>
            <div
              style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
              role="radiogroup"
              aria-label="Dark mode"
            >
              {DARK_MODES.map((mode) => {
                const selected = mode.id === darkMode;
                return (
                  <button
                    key={mode.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => {
                      setDarkMode(mode.id);
                      toast.success(`Appearance set to ${mode.label}`);
                    }}
                    title={mode.hint}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 14px",
                      borderRadius: "var(--radius-md)",
                      border: `1px solid ${
                        selected ? "var(--primary)" : "var(--border)"
                      }`,
                      background: selected ? "var(--primary-bg)" : "var(--surface)",
                      color: selected ? "var(--primary)" : "var(--text-secondary)",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "var(--transition-fast)",
                    }}
                  >
                    {mode.id === "dark" ? (
                      <IconMoon size={14} />
                    ) : mode.id === "light" ? (
                      <IconSun size={14} />
                    ) : null}
                    {mode.label}
                  </button>
                );
              })}
            </div>
          </PageCardBody>
          </PageCard>

          <PageCard className="general-page__section-card">
            <PageCardHeader>
            <div className="general-page__section-head">
              <Badge variant="info" icon={<IconSettings size={12} />}>
                Typography
              </Badge>
              <span className="general-page__section-note">
                Current: {activeFont.name} · applies instantly and is saved on
                this device
              </span>
            </div>
            </PageCardHeader>
            <PageCardBody>
            <div
              style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
              role="radiogroup"
              aria-label="Application font"
            >
              {FONTS.map((f) => {
                const selected = f.id === font;
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => {
                      setFont(f.id);
                      toast.success(`Font set to ${f.name}`);
                    }}
                    title={f.desc}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "7px 14px",
                      borderRadius: "var(--radius-md)",
                      border: `1px solid ${
                        selected ? "var(--primary)" : "var(--border)"
                      }`,
                      background: selected
                        ? "var(--primary-bg)"
                        : "var(--surface)",
                      color: selected
                        ? "var(--primary)"
                        : "var(--text-secondary)",
                      fontWeight: 600,
                      fontFamily: f.stack,
                      cursor: "pointer",
                      transition: "var(--transition-fast)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 16,
                        lineHeight: 1,
                        fontFamily: f.stack,
                      }}
                    >
                      Aa
                    </span>
                    {f.name}
                  </button>
                );
              })}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 14,
                maxWidth: 420,
              }}
            >
              <span
                style={{
                  fontSize: "var(--fs-sm)",
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                  minWidth: 70,
                }}
              >
                Text size
              </span>
              <input
                type="range"
                min={12}
                max={18}
                step={1}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                aria-label="Text size"
                style={{ flex: 1, accentColor: "var(--primary)", cursor: "pointer" }}
              />
              <span
                style={{
                  fontSize: "var(--fs-sm)",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  minWidth: 44,
                  textAlign: "right",
                }}
              >
                {fontSize}px
              </span>
            </div>
          </PageCardBody>
          </PageCard>

          <PageCard className="general-page__section-card">
            <PageCardHeader>
            <div className="general-page__section-head">
              <Badge variant="info" icon={<IconSettings size={12} />}>
                Layout
              </Badge>
              <span className="general-page__section-note">
                App width, spacing density and corner style · saved on this
                device
              </span>
            </div>
            </PageCardHeader>
            <PageCardBody>
            <div
              style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
              role="radiogroup"
              aria-label="App width"
            >
              <SettingButton
                selected={layout === "full"}
                onClick={() => setLayout("full")}
                title="Content stretches edge to edge"
              >
                <IconExpand size={14} />
                Full screen
              </SettingButton>
              <SettingButton
                selected={layout === "boxed"}
                onClick={() => setLayout("boxed")}
                title="Content centered at a max width; wallpaper stays full-bleed"
              >
                <IconBox size={14} />
                Boxed
              </SettingButton>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                maxWidth: 420,
              }}
            >
              <span
                style={{
                  fontSize: "var(--fs-sm)",
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                  minWidth: 70,
                }}
              >
                Density
              </span>
              <input
                type="range"
                min={70}
                max={130}
                step={5}
                value={density}
                onChange={(e) => setDensity(Number(e.target.value))}
                aria-label="Spacing density"
                title="Spacing scale in percent (70% = very compact, 80% = default, 130% = spacious)"
                style={{ flex: 1, accentColor: "var(--primary)", cursor: "pointer" }}
              />
              <span
                style={{
                  fontSize: "var(--fs-sm)",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  minWidth: 44,
                  textAlign: "right",
                }}
              >
                {density}%
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 10,
                maxWidth: 420,
              }}
            >
              <span
                style={{
                  fontSize: "var(--fs-sm)",
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                  minWidth: 70,
                }}
              >
                Component
                <br />
                size
              </span>
              <input
                type="range"
                min={50}
                max={100}
                step={5}
                value={compSize}
                onChange={(e) => setCompSize(Number(e.target.value))}
                aria-label="Component size"
                title="Scales the physical size of buttons, inputs and table rows (50% = dense, 75% = default, 100% = large)"
                style={{ flex: 1, accentColor: "var(--primary)", cursor: "pointer" }}
              />
              <span
                style={{
                  fontSize: "var(--fs-sm)",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  minWidth: 44,
                  textAlign: "right",
                }}
              >
                {compSize}%
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 10,
                maxWidth: 420,
              }}
            >
              <span
                style={{
                  fontSize: "var(--fs-sm)",
                  color: "var(--text-muted)",
                  whiteSpace: "nowrap",
                  minWidth: 70,
                }}
              >
                Corners
              </span>
              <input
                type="range"
                min={0}
                max={20}
                step={1}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                aria-label="Corner radius"
                title="Corner radius in pixels (0 = square, 20 = very rounded)"
                style={{ flex: 1, accentColor: "var(--primary)", cursor: "pointer" }}
              />
              <span
                style={{
                  fontSize: "var(--fs-sm)",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  minWidth: 44,
                  textAlign: "right",
                }}
              >
                {radius}px
              </span>
            </div>
            {layout === "boxed" && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginTop: 10,
                  maxWidth: 420,
                }}
              >
                <span
                  style={{
                    fontSize: "var(--fs-sm)",
                    color: "var(--text-muted)",
                    whiteSpace: "nowrap",
                    minWidth: 70,
                  }}
                >
                  Boxed gap
                </span>
                <input
                  type="range"
                  min={20}
                  max={400}
                  step={10}
                  value={boxedGap}
                  onChange={(e) => setBoxedGap(Number(e.target.value))}
                  aria-label="Boxed gap"
                  title="Empty space left/right of the content in Boxed layout (20–400px)"
                  style={{ flex: 1, accentColor: "var(--primary)", cursor: "pointer" }}
                />
                <span
                  style={{
                    fontSize: "var(--fs-sm)",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    minWidth: 44,
                    textAlign: "right",
                  }}
                >
                  {boxedGap}px
                </span>
              </div>
            )}
          </PageCardBody>
          </PageCard>

          <PageCard className="general-page__section-card">
            <PageCardHeader>
            <div className="general-page__section-head">
              <Badge variant="info" icon={<IconSettings size={12} />}>
                Motion
              </Badge>
              <span className="general-page__section-note">
                {reduceMotion
                  ? "Animations disabled"
                  : "Animations enabled"}
                · saved on this device
              </span>
            </div>
            </PageCardHeader>
            <PageCardBody>
            <div
              style={{ display: "flex", gap: 8 }}
              role="radiogroup"
              aria-label="Motion"
            >
              <SettingButton
                selected={!reduceMotion}
                onClick={() => setReduceMotion(false)}
                title="Keep fade, slide and scale animations"
              >
                Enabled
              </SettingButton>
              <SettingButton
                selected={reduceMotion}
                onClick={() => setReduceMotion(true)}
                title="Disable animations and transitions"
              >
                Reduced
              </SettingButton>
            </div>
          </PageCardBody>
          </PageCard>

          <PageCard className="general-page__section-card general-page__section-card--full">
            <PageCardHeader>
            <div className="general-page__section-head">
              <Badge variant="info" icon={<IconImage size={12} />}>
                Images
              </Badge>
              <span className="general-page__section-note">
                App logo and background images · saved on this device
              </span>
            </div>
            </PageCardHeader>
            <PageCardBody>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: 14,
              }}
            >
              <BgImageRow
                label="Logo"
                value={logoImage}
                onChange={setLogoImage}
                previewStyle={{
                  backgroundImage: logoImage ? `url("${logoImage}")` : "none",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
                hint="Shown in the top bar · falls back to the default logo when not set"
              />
              <BgImageRow
                label="Workspace"
                value={bgImage}
                onChange={setBgImage}
                colorValue={bgColor}
                onColorChange={setBgColor}
                previewStyle={{
                  background: bgColor || "var(--surface-alt)",
                  backgroundImage: bgColor
                    ? "none"
                    : "linear-gradient(var(--bg-scrim, rgba(255,255,255,0.65)), var(--bg-scrim, rgba(255,255,255,0.65))), var(--bg-image)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
                hint="Workspace page — solid color or image; falls back to the Page background when not set"
              />
              <BgImageRow
                label="Title bar"
                value={titlebarBgImage}
                onChange={setTitlebarBgImage}
                colorValue={titlebarBgColor}
                onColorChange={setTitlebarBgColor}
                previewStyle={{
                  background: titlebarBgColor || "var(--titlebar-bg)",
                }}
                hint="Window title bars — solid color or image; uses the default color when not set"
              />
              <BgImageRow
                label="Page background"
                value={pageBgImage}
                onChange={setPageBgImage}
                colorValue={pageBgColor}
                onColorChange={setPageBgColor}
                previewStyle={{
                  background: pageBgColor || "var(--surface-alt)",
                  backgroundImage: pageBgColor
                    ? "none"
                    : "linear-gradient(var(--page-scrim, rgba(255,255,255,0.55)), var(--page-scrim, rgba(255,255,255,0.55))), var(--page-bg-image)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
                hint="Whole-app wallpaper — solid color or image; uses the default theme color when not set"
              />
              <BgImageRow
                label="Top bar"
                value={topbarBgImage}
                onChange={setTopbarBgImage}
                colorValue={topbarBgColor}
                onColorChange={setTopbarBgColor}
                previewStyle={{
                  background: topbarBgColor || "var(--topbar-bg)",
                }}
                hint="App top bar — solid color or image; uses the default header color when not set"
              />
            </div>
          </PageCardBody>
          </PageCard>

          <PageCard className="general-page__section-card general-page__section-card--full">
            <PageCardHeader>
            <div className="general-page__section-head">
              <Badge variant="info" icon={<IconPalette size={12} />}>
                Wallpaper presets
              </Badge>
              <span className="general-page__section-note">
                Choose a target, then click a wallpaper to set it · saved on
                this device
              </span>
            </div>
            </PageCardHeader>
            <PageCardBody>
            <div
              style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
              role="radiogroup"
              aria-label="Preset target"
            >
              {[
                { id: "topbar", label: "Top Bar" },
                { id: "workspace", label: "Workspace" },
                { id: "page", label: "Page Background" },
                { id: "titlebar", label: "Page Title" },
              ].map((t) => (
                <SettingButton
                  key={t.id}
                  selected={presetTarget === t.id}
                  onClick={() => setPresetTarget(t.id)}
                  title={`Apply presets to the ${t.label.toLowerCase()}`}
                >
                  {t.label}
                </SettingButton>
              ))}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: 10,
                marginTop: 10,
              }}
            >
              {WALLPAPER_PRESETS.map((p) => {
                const thumb = presetThumbs[p.id];
                const full = presetFull[p.id];
                const busy = loadingPreset === p.id;
                // The target's current value — used for the active highlight
                // and to apply the preset to the right area.
                const targetValue = {
                  workspace: bgImage,
                  page: pageBgImage,
                  topbar: topbarBgImage,
                  titlebar: titlebarBgImage,
                }[presetTarget];
                const targetSetter = {
                  workspace: setBgImage,
                  page: setPageBgImage,
                  topbar: setTopbarBgImage,
                  titlebar: setTitlebarBgImage,
                }[presetTarget];
                const targetLabel = {
                  workspace: "Workspace",
                  page: "Page background",
                  topbar: "Top bar",
                  titlebar: "Title bar",
                }[presetTarget];
                const active = full && targetValue === full;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() =>
                      handlePresetClick(p, targetSetter, targetLabel)
                    }
                    title={`${p.name} — ${p.desc}`}
                    aria-pressed={active}
                    disabled={!thumb || busy}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                      padding: 8,
                      borderRadius: "var(--radius-lg)",
                      border: `2px solid ${
                        active ? "var(--primary)" : "var(--border)"
                      }`,
                      background: active
                        ? "var(--primary-bg)"
                        : "var(--surface)",
                      cursor: thumb && !busy ? "pointer" : "default",
                      opacity: thumb ? 1 : 0.6,
                      transition: "var(--transition-fast)",
                    }}
                  >
                    <span
                      style={{
                        width: "100%",
                        aspectRatio: "16/9",
                        borderRadius: "var(--radius-md)",
                        backgroundImage: thumb ? `url("${thumb}")` : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundColor: thumb
                          ? "transparent"
                          : "var(--border)",
                        display: "block",
                      }}
                    />
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "var(--fs-sm)",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                        }}
                      >
                        {busy ? "Loading…" : p.name}
                      </span>
                      {active && <IconCheck size={14} />}
                    </span>
                    <span
                      style={{
                        fontSize: "var(--fs-xs)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {p.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </PageCardBody>
          </PageCard>

          <PageCard className="general-page__section-card general-page__section-card--full">
            <PageCardHeader>
            <div className="general-page__section-head">
              <Badge variant="info" icon={<IconSettings size={12} />}>
                Background animation
              </Badge>
              <span className="general-page__section-note">
                {bgAnimMode === "always"
                  ? "Rain & snow falls continuously — works alongside you"
                  : "Rain & snow starts after the screen is idle"}
              </span>
            </div>
            </PageCardHeader>
            <PageCardBody>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  maxWidth: 520,
                }}
              >
                {/* Mode: Idle vs Always */}
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      fontSize: "var(--fs-sm)",
                      color: "var(--text-muted)",
                      whiteSpace: "nowrap",
                      minWidth: 70,
                    }}
                  >
                    Mode
                  </span>
                  <div style={{ display: "flex", gap: 8 }} role="radiogroup" aria-label="Animation trigger mode">
                    <SettingButton
                      selected={bgAnimMode !== "always"}
                      onClick={() => setBgAnimMode("idle")}
                      title="Rain starts only when the screen has been idle for the set time"
                    >
                      Idle
                    </SettingButton>
                    <SettingButton
                      selected={bgAnimMode === "always"}
                      onClick={() => setBgAnimMode("always")}
                      title="Rain falls continuously — non-blocking, you can work through it"
                    >
                      Always
                    </SettingButton>
                  </div>
                </div>

                {/* Sliders */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  {
                    key: "idleMin",
                    label: "Idle time",
                    min: 0,
                    max: 10,
                    step: 1,
                    title: "Screen idle time threshold before the rain starts falling (0 = disabled)",
                  },
                  {
                    key: "density",
                    label: "Density",
                    min: 20,
                    max: 200,
                    step: 5,
                    unit: "%",
                    title: "How many droplets are on screen (100% = default)",
                  },
                  {
                    key: "opacity",
                    label: "Opacity",
                    min: 20,
                    max: 100,
                    step: 5,
                    unit: "%",
                    title: "How strong/visible the drops are",
                  },
                  {
                    key: "size",
                    label: "Drop size",
                    min: 20,
                    max: 150,
                    step: 5,
                    unit: "%",
                    title: "Scales the droplet radii (100% = default)",
                  },
                  {
                    key: "speed",
                    label: "Speed / wind",
                    min: 5,
                    max: 100,
                    step: 5,
                    unit: "%",
                    title: "How fast drops fall — higher speeds also push them sideways with more wind",
                  },
                ].filter((s) => !(s.key === "idleMin" && bgAnimMode === "always")).map((s) => (
                  <div
                    key={s.key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "var(--fs-sm)",
                        color: "var(--text-muted)",
                        whiteSpace: "nowrap",
                        minWidth: 70,
                      }}
                    >
                      {s.label}
                    </span>
                    <input
                      type="range"
                      min={s.min}
                      max={s.max}
                      step={s.step}
                      value={bgAnimSettings?.[s.key] ?? (s.key === "idleMin" ? 1 : 100)}
                      onChange={(e) =>
                        setBgAnimSetting(s.key, Number(e.target.value))
                      }
                      aria-label={`Rain ${s.label}`}
                      title={s.title}
                      style={{
                        flex: 1,
                        accentColor: "var(--primary)",
                        cursor: "pointer",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "var(--fs-sm)",
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        minWidth: 44,
                        textAlign: "right",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s.key === "idleMin" ? (
                        (bgAnimSettings?.idleMin ?? 1) === 0 ? "Off" : `${bgAnimSettings?.idleMin ?? 1} min`
                      ) : (
                        `${bgAnimSettings?.[s.key] ?? 100}${s.unit}`
                      )}
                    </span>
                  </div>
                ))}
                </div>
                {/* Drop color */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span
                    style={{
                      fontSize: "var(--fs-sm)",
                      color: "var(--text-muted)",
                      whiteSpace: "nowrap",
                      minWidth: 70,
                    }}
                  >
                    Drop color
                  </span>
                  <input
                    type="color"
                    value={bgAnimSettings?.color ?? getRainColor(themeColor, customColor)}
                    onChange={(e) => setBgAnimSetting("color", e.target.value)}
                    aria-label="Rain drop color"
                    style={{
                      width: 44,
                      height: 30,
                      padding: 0,
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      background: "var(--surface)",
                      cursor: "pointer",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "var(--fs-sm)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {bgAnimSettings?.color ?? getRainColor(themeColor, customColor)}
                  </span>
                </div>
              </div>
            </PageCardBody>
          </PageCard>

          <PageCard className="general-page__section-card general-page__section-card--full">
            <PageCardHeader>
            <div className="general-page__section-head">
              <Badge variant="accent" icon={<IconInfo size={12} />}>
                Preview
              </Badge>
              <span className="general-page__section-note">
                Buttons, badges and surfaces follow the selected color
              </span>
            </div>
            </PageCardHeader>
            <PageCardBody>
            <div className="general-page__preview-card">
              <span className="general-page__preview-title">Sample card</span>
              <span className="general-page__preview-desc">
                This is how controls look with the current theme color.
              </span>
              <div className="general-page__preview-row">
                <Button size="sm">Primary</Button>
                <Button variant="outline" size="sm">
                  Outline
                </Button>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
              </div>
            </div>
          </PageCardBody>
          </PageCard>
          </div>
        </PageCardBody>
        <PageCardFooter>
          <Badge variant="info" icon={<IconInfo size={12} />}>
            Theme preference is stored in your browser and persists across
            sessions
          </Badge>
        </PageCardFooter>
      </PageCard>
    </div>
  );
};

export default ThemePage;
