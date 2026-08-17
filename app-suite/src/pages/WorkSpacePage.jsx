import { useApp } from "@/context/AppContext";
import RainGlass from "@/components/RainGlass";

const WorkSpacePage = () => {
  const { bgAnim, bgAnimScope, bgAnimSettings } = useApp();
  // Local overlay only when the animation is scoped to this page; the
  // "app" scope renders a fixed full-viewport overlay from App.jsx instead.
  const showRain = bgAnim === "rain" && bgAnimScope !== "app";
  const rain =
    bgAnimSettings && typeof bgAnimSettings === "object"
      ? bgAnimSettings
      : { density: 100, color: "#dbeafe", opacity: 100, size: 100 };

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 132px)",
        userSelect: "none",
        // Optional background image (Theme page) with a readability scrim
        // that flips per color mode (--bg-scrim). Falls back to none.
        backgroundImage:
          "linear-gradient(var(--bg-scrim, rgba(255,255,255,0.65)), var(--bg-scrim, rgba(255,255,255,0.65))), var(--bg-image)",
        backgroundColor: "var(--bg-color, transparent)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Rain on glass — decorative droplet animation layered over the
          background but under the heading (Theme page > Background animation).
          The canvas fills this pane and ignores pointer events. */}
      {showRain && (
        <RainGlass
          density={rain.density / 100}
          color={rain.color}
          opacity={rain.opacity / 100}
          size={rain.size / 100}
          speed={rain.speed / 100}
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}
      <h1
        style={{
          position: "relative",
          zIndex: 2,
          margin: 0,
          fontSize: 52,
          fontWeight: 800,
          letterSpacing: 2,
          color: "color-mix(in srgb, var(--text-secondary) 45%, var(--surface))",
          textShadow:
            "0 -1px 0 rgba(255,255,255,0.85), 0 1px 1px rgba(0,0,0,0.22)",
        }}
      >
        bSuite Workspace
      </h1>
    </div>
  );
};
export default WorkSpacePage;
