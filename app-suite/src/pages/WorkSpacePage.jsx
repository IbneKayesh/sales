const WorkSpacePage = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "calc(100vh - 132px)",
        userSelect: "none",
      }}
    >
      <h1
        style={{
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
