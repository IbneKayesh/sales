/* ==========================================================================
   PrintBody — shared body building blocks for printed documents
   (MRR / Journal / Invoice)

   Exports:
     PrintBody      — bordered info block + main lines table + optional
                      summary + extra sections (children)
     PrintTable     — generic print table (columns + rows + optional footer)
     PrintSection   — titled sub-section with an underlined header
     MetaItem       — small label/value cell used inside info blocks
   ========================================================================== */

export const MetaItem = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 0,
      lineHeight: 1.25,
      minWidth: 0,
    }}
  >
    <span
      style={{
        fontSize: 7,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: "#555",
      }}
    >
      {label}
    </span>
    <span style={{ fontSize: 10, fontWeight: 600, color: "#000" }}>
      {value || "—"}
    </span>
  </div>
);

const sectionTitleStyle = {
  fontSize: 9,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  borderBottom: "1px solid #000",
  paddingBottom: 2,
  marginBottom: 2,
};

/* --------------------------------------------------------------------------
   PrintSection — titled block (e.g. "Costing Details", "Payment Details")
   -------------------------------------------------------------------------- */

export const PrintSection = ({ title, children, marginTop = 8 }) => (
  <div style={{ marginTop }}>
    <div style={sectionTitleStyle}>{title}</div>
    {children}
  </div>
);

/* --------------------------------------------------------------------------
   PrintTable — generic print table
   columns: [{ key?, header, width?, align? ("left"|"right"), render?(row) }]
   rows:    data objects
   footer:  optional React node rendered in the totals row (tfoot)
   -------------------------------------------------------------------------- */

export const PrintTable = ({
  columns = [],
  rows = [],
  footer,
  emptyText = "No data",
}) => {
  const colSpan = columns.length || 1;
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 9 }}>
      <thead>
        <tr>
          {columns.map((col, ci) => (
            <th
              key={col.key ?? ci}
              style={{
                ...(col.width ? { width: col.width } : {}),
                textAlign: col.align || "left",
              }}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length > 0 ? (
          rows.map((row, idx) => (
            <tr key={row.id || idx}>
              {columns.map((col, ci) => (
                <td key={col.key ?? ci} style={{ textAlign: col.align || "left" }}>
                  {col.render
                    ? col.render(row, idx)
                    : col.key
                      ? row[col.key] ?? "—"
                      : "—"}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={colSpan} style={{ textAlign: "center", color: "#666" }}>
              {emptyText}
            </td>
          </tr>
        )}
      </tbody>
      {footer && <tfoot>{footer}</tfoot>}
    </table>
  );
};

/* --------------------------------------------------------------------------
   PrintBody — the standard document body:
     info block (meta grid or custom content, optional note line)
     + main lines table (columns/rows/footer)
     + optional summary grid
     + extra sections passed as children
   -------------------------------------------------------------------------- */

const infoBlockStyle = {
  border: "1px solid #ccc",
  borderRadius: 4,
  marginBottom: 4,
  overflow: "hidden",
};

const noteStyle = { fontSize: 10, padding: "2px 8px" };

const PrintBody = ({
  // Info block
  metaGrid,
  metaColumns,
  metaChildren,
  note,
  noteLabel = "Note",
  // Main lines table
  columns = [],
  rows = [],
  footer,
  emptyText = "No data",
  // Summary grid (right-aligned label/value pairs)
  summary = [],
  // Extra sections (e.g. costing / payments) rendered after the table
  children,
}) => (
  <>
    {/* Info block */}
    <div style={infoBlockStyle}>
      {metaChildren
        ? metaChildren
        : metaGrid && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  metaColumns ||
                  `repeat(${Math.min(metaGrid.length, 6)}, 1fr)`,
                gap: "4px 12px",
                padding: "3px 8px",
              }}
            >
              {metaGrid.map((m, idx) => (
                <MetaItem key={idx} label={m.label} value={m.value} />
              ))}
            </div>
          )}
      {note && (
        <div style={{ ...noteStyle, borderTop: "1px solid #e5e7eb" }}>
          <span style={{ fontWeight: 700 }}>{noteLabel}: </span>
          {note}
        </div>
      )}
    </div>

    {/* Main lines table */}
    <PrintTable
      columns={columns}
      rows={rows}
      footer={footer}
      emptyText={emptyText}
    />

    {/* Summary grid */}
    {summary.length > 0 && (
      <div
        style={{
          marginTop: 10,
          marginLeft: "auto",
          width: "52%",
          fontSize: 10,
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "2px 12px",
          alignItems: "center",
        }}
      >
        {summary.flatMap((row, idx) => [
          <span
            key={`l${idx}`}
            style={row.strong ? { fontWeight: 700, borderTop: row.divider ? "1px solid #000" : undefined, paddingTop: row.divider ? 3 : undefined, marginTop: row.divider ? 3 : undefined } : undefined}
          >
            {row.label}
          </span>,
          <strong
            key={`v${idx}`}
            style={{
              textAlign: "right",
              fontWeight: row.strong ? 700 : undefined,
              ...(row.divider
                ? { borderTop: "1px solid #000", paddingTop: 3, marginTop: 3 }
                : {}),
            }}
          >
            {row.value}
          </strong>,
        ])}
      </div>
    )}

    {/* Extra sections */}
    {children}
  </>
);

export default PrintBody;
