import { useState, useEffect } from "react";
import "../inventory/InventoryPage.css";

// Predefined style presets for desktop backgrounds
const backgroundPresets = [
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

const SetupPage = ({ onSetDesktopBackground }) => {
  const [customBackground, setCustomBackground] = useState("");
  const [savedBackground, setSavedBackground] = useState(null);

  // Load saved background from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("desktopBackground");
    if (saved) {
      setSavedBackground(saved);
    }
  }, []);

  const handlePresetSelect = (preset) => {
    if (onSetDesktopBackground) {
      onSetDesktopBackground(preset.value);
      // Save to localStorage
      localStorage.setItem("desktopBackground", preset.value);
    }
  };

  const handleCustomImageUrl = (url) => {
    if (url.trim()) {
      const backgroundValue = `url('${url}') center/cover`;
      if (onSetDesktopBackground) {
        onSetDesktopBackground(backgroundValue);
        // Save to localStorage
        localStorage.setItem("desktopBackground", backgroundValue);
      }
      setCustomBackground(url);
    }
  };

  const handleLoadLastUsed = () => {
    if (savedBackground && onSetDesktopBackground) {
      onSetDesktopBackground(savedBackground);
    }
  };

  return (
    <div className="page-container">
      <div className="page-section">
        <h2>Desktop Setup</h2>
      </div>

      <div className="page-section">
        <h3>Background Style Presets</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "12px",
            marginTop: "12px",
          }}
        >
          {backgroundPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset)}
              style={{
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid var(--win11-border)",
                background: "var(--win11-panel)",
                color: "inherit",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="page-section">
        <h3>Custom Image URL</h3>
        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          <input
            type="text"
            placeholder="Enter image URL"
            value={customBackground}
            onChange={(e) => setCustomBackground(e.target.value)}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid var(--win11-border)",
              background: "var(--win11-input)",
              color: "inherit",
              fontSize: "12px",
            }}
          />
          <button
            onClick={() => handleCustomImageUrl(customBackground)}
            style={{
              padding: "8px 16px",
              borderRadius: "4px",
              border: "1px solid var(--win11-border)",
              background: "var(--win11-panel-active)",
              color: "inherit",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "500",
            }}
          >
            Apply
          </button>
        </div>
        <p
          style={{
            fontSize: "11px",
            color: "var(--win11-muted)",
            marginTop: "8px",
          }}
        >
          Enter a valid image URL to set a custom background image
        </p>
      </div>

      {savedBackground && (
        <div className="page-section">
          <h3>Saved Background</h3>
          <button
            onClick={handleLoadLastUsed}
            style={{
              padding: "8px 16px",
              borderRadius: "4px",
              border: "1px solid var(--win11-border)",
              background: "var(--win11-accent)",
              color: "white",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: "500",
            }}
          >
            Load Last Used Background
          </button>
          <p
            style={{
              fontSize: "11px",
              color: "var(--win11-muted)",
              marginTop: "8px",
            }}
          >
            Your last used background has been saved. Click to restore it.
          </p>
        </div>
      )}
    </div>
  );
};

export default SetupPage;
