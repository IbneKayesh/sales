const WorkSpacePage = () => {
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
