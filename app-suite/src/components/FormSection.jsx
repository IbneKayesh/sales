/**
 * FormSection — groups form fields under a visible section title with a
 * subtle divider, so long data-entry forms are scannable (classic desktop
 * ERP style: "General / Address / Remarks").
 */
export default function FormSection({ title, children, style, ...rest }) {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--sp-2)",
        minWidth: 0,
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginTop: "var(--sp-2)",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.7,
            color: "var(--text-secondary)",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </span>
        <span style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>
      {children}
    </section>
  );
}
