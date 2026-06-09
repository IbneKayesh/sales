import { useState, useEffect } from "react";
import { getStorageLoginData, setStorageLoginData } from "@/utils/storage";

// Predefined style presets for desktop backgrounds
const backgroundColors = [
  {
    id: "default",
    name: "Default",
    value:
      "radial-gradient(900px 520px at 18% 12%, var(--win11-body-glow-primary), var(--win11-transparent) 58%), radial-gradient(720px 420px at 78% 18%, var(--win11-body-glow-secondary), var(--win11-transparent) 62%), linear-gradient(135deg, var(--win11-bg), var(--win11-bg-deep))",
  },
  {
    id: "blue-sunset",
    name: "Blue Sunset",
    value:
      "radial-gradient(900px 520px at 18% 12%, #4a90e2, transparent 58%), radial-gradient(720px 420px at 78% 18%, #f5a623, transparent 62%), linear-gradient(135deg, #1a1a2e, #16213e)",
  },
  {
    id: "purple-night",
    name: "Purple Night",
    value:
      "radial-gradient(900px 520px at 18% 12%, #8b5cf6, transparent 58%), radial-gradient(720px 420px at 78% 18%, #d946ef, transparent 62%), linear-gradient(135deg, #1a0033, #2d1b4e)",
  },
  {
    id: "green-forest",
    name: "Green Forest",
    value:
      "radial-gradient(900px 520px at 18% 12%, #10b981, transparent 58%), radial-gradient(720px 420px at 78% 18%, #34d399, transparent 62%), linear-gradient(135deg, #064e3b, #047857)",
  },
  {
    id: "dark-minimal",
    name: "Dark Minimal",
    value: "linear-gradient(135deg, #0f0f0f, #1a1a1a)",
  },
];

const backgroundImages = [
  {
    id: "default",
    name: "Default",
    value: 'url("/assets/wallpapers/fractalize-cool_backgrounds.png")',
  },
  {
    id: "ruby-garden",
    name: "Ruby Garden",
    value: 'url("/assets/wallpapers/fractalize-ruby_garden.png")',
  },
  {
    id: "bean",
    name: "Bean",
    value: "url('/assets/wallpapers/unsplash-bean.jpg')",
  },
  {
    id: "silva",
    name: "Silva",
    value: "url('/assets/wallpapers/unsplash-silva.jpg')",
  },
  {
    id: "abstract-silk",
    name: "Abstract Silk",
    value: "url('/assets/wallpapers/abstract-silk.png')",
  },
  {
    id: "forest",
    name: "Forest",
    value: "url('/assets/wallpapers/forest.png')",
  },
  {
    id: "nebula",
    name: "Nebula",
    value: "url('/assets/wallpapers/nebula.png')",
  },
];

// Topbar background presets
const topbarColors = [
  { id: "default", name: "Default", value: "var(--win11-panel)" },
  { id: "blue", name: "Blue", value: "#2563eb" },
  { id: "purple", name: "Purple", value: "#7c3aed" },
  { id: "green", name: "Green", value: "#059669" },
  { id: "dark", name: "Dark", value: "#1f2937" },
];

const SetupDesktopPage = ({
  callFunction1, //set desktop background
  callFunction2,
}) => {
  const [customBackground, setCustomBackground] = useState("");
  const [desktopColor, setDesktopColor] = useState("#2563eb");
  const [topbarColor, setTopbarColor] = useState("#2563eb");
  const [topbarImage, setTopbarImage] = useState("");

  const handleCustomImageUrl = (url) => {
    if (url.trim()) {
      const backgroundValue = `url('${url}')`;
      callFunction1("background", { value: backgroundValue });
      setCustomBackground(url);
    }
  };

  const handleCustomBackgroundColor = (color) => {
    callFunction1("background", { value: color });
    setDesktopColor(color);
  };

  const handletopbarColorselect = (preset) => {
    if (onSetTopbarBackground) {
      onSetTopbarBackground(preset.value);
      localStorage.setItem("topbarBackground", preset.value);
    }
    setTopbarColor(preset.value);
  };

  const handleTopbarColorChange = (color) => {
    if (onSetTopbarBackground) {
      onSetTopbarBackground(color);
      localStorage.setItem("topbarBackground", color);
    }
    setTopbarColor(color);
  };

  const handleTopbarImageApply = (url) => {
    if (url.trim()) {
      const backgroundValue = `url('${url}') center/cover`;
      if (onSetTopbarBackground) {
        onSetTopbarBackground(backgroundValue);
        localStorage.setItem("topbarBackground", backgroundValue);
      }
      setTopbarImage(url);
    }
  };

  return (
    <div className="page-container">
      <div className="topbar-button-container">
        <button className={`btn-default`} aria-label="Add" type="button">
          Add
        </button>
        <button className={`btn-default`} aria-label="Save" type="button">
          Save
        </button>
        <button className={`btn-default`} aria-label="Search" type="button">
          Search
        </button>
      </div>

      {/* Desktop Background Section */}
      <div className="page-section">
        <h3>Desktop Background</h3>

        <h4 style={{ marginTop: "12px", fontSize: "12px", fontWeight: "600" }}>
          Background Presets
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
            gap: "8px",
            marginTop: "8px",
          }}
        >
          {backgroundColors.map((preset) => (
            <button
              key={preset.id}
              onClick={() => callFunction1("background",preset)}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid var(--win11-border)",
                background: "var(--win11-panel)",
                color: "inherit",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: "500",
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>

        <h4 style={{ marginTop: "12px", fontSize: "12px", fontWeight: "600" }}>
          Background Images
        </h4>
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {backgroundImages.map((image) => (
            <div
              key={image.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                onClick={() => callFunction1("background",image)}
                style={{
                  backgroundImage: image.value,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: "64px",
                  height: "64px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  border: "1px solid #ccc",
                }}
              />
              <span style={{ fontSize: "11px", marginTop: "4px" }}>
                {image.name}
              </span>
            </div>
          ))}
        </div>

        <h4 style={{ marginTop: "12px", fontSize: "12px", fontWeight: "600" }}>
          Custom Color
        </h4>
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <input
            type="color"
            value={desktopColor}
            onChange={(e) => handleCustomBackgroundColor(e.target.value)}
            style={{
              width: "60px",
              height: "32px",
              borderRadius: "4px",
              border: "1px solid var(--win11-border)",
              cursor: "pointer",
            }}
          />
          <input
            type="text"
            placeholder="#000000"
            value={desktopColor}
            onChange={(e) => handleCustomBackgroundColor(e.target.value)}
            style={{
              flex: 1,
              padding: "6px 8px",
              borderRadius: "4px",
              border: "1px solid var(--win11-border)",
              background: "var(--win11-input)",
              color: "inherit",
              fontSize: "11px",
            }}
          />
        </div>

        <h4 style={{ marginTop: "12px", fontSize: "12px", fontWeight: "600" }}>
          Custom Image URL
        </h4>
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <input
            type="text"
            placeholder="Enter image URL"
            value={customBackground}
            onChange={(e) => setCustomBackground(e.target.value)}
            style={{
              flex: 1,
              padding: "6px 8px",
              borderRadius: "4px",
              border: "1px solid var(--win11-border)",
              background: "var(--win11-input)",
              color: "inherit",
              fontSize: "11px",
            }}
          />
          <button
            onClick={() => handleCustomImageUrl(customBackground)}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid var(--win11-border)",
              background: "var(--win11-accent)",
              color: "white",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: "500",
            }}
          >
            Apply
          </button>
        </div>
      </div>

      <div className="page-section">
        <h3>Desktop Widgets</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
            gap: "8px",
            marginTop: "8px",
          }}
        >
          <button
            onClick={() => callFunction1("widget", "analog-clock")}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid var(--win11-border)",
              background: "var(--win11-panel)",
              color: "inherit",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: "500",
            }}
          >
            Analog Clock
          </button>
          <button
            onClick={() => callFunction1("widget", "digital-clock")}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid var(--win11-border)",
              background: "var(--win11-panel)",
              color: "inherit",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: "500",
            }}
          >
            Digital Clock
          </button>
        </div>
      </div>

      {/* Topbar Background Section */}
      <div className="page-section">
        <h3>Form Window Topbar</h3>

        <h4 style={{ marginTop: "12px", fontSize: "12px", fontWeight: "600" }}>
          Color Presets
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
            gap: "8px",
            marginTop: "8px",
          }}
        >
          {topbarColors.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handletopbarColorselect(preset)}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "2px solid var(--win11-border)",
                background: preset.value,
                color: "inherit",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: "500",
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>

        <h4 style={{ marginTop: "12px", fontSize: "12px", fontWeight: "600" }}>
          Custom Color
        </h4>
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <input
            type="color"
            value={topbarColor}
            onChange={(e) => handleTopbarColorChange(e.target.value)}
            style={{
              width: "60px",
              height: "32px",
              borderRadius: "4px",
              border: "1px solid var(--win11-border)",
              cursor: "pointer",
            }}
          />
          <input
            type="text"
            placeholder="#2563eb"
            value={topbarColor}
            onChange={(e) => handleTopbarColorChange(e.target.value)}
            style={{
              flex: 1,
              padding: "6px 8px",
              borderRadius: "4px",
              border: "1px solid var(--win11-border)",
              background: "var(--win11-input)",
              color: "inherit",
              fontSize: "11px",
            }}
          />
        </div>

        <h4 style={{ marginTop: "12px", fontSize: "12px", fontWeight: "600" }}>
          Background Image URL
        </h4>
        <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
          <input
            type="text"
            placeholder="Enter image URL"
            value={topbarImage}
            onChange={(e) => setTopbarImage(e.target.value)}
            style={{
              flex: 1,
              padding: "6px 8px",
              borderRadius: "4px",
              border: "1px solid var(--win11-border)",
              background: "var(--win11-input)",
              color: "inherit",
              fontSize: "11px",
            }}
          />
          <button
            onClick={() => handleTopbarImageApply(topbarImage)}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid var(--win11-border)",
              background: "var(--win11-accent)",
              color: "white",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: "500",
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupDesktopPage;
