/* ==========================================================================
   Small shared building blocks for PrintModal bodies.
     PrintTable    — generic print table (columns + rows + optional footer)
     PrintSection  — titled sub-section with an underlined header
     MetaGrid      — label/value grid (info block)
     Summary       — right-aligned label/value totals grid
   ========================================================================== */

import { MetaItem } from "./format.jsx";

/* --------------------------------------------------------------------------
   PrintSection — titled block (e.g. "Costing Details", "Payment Details")
   -------------------------------------------------------------------------- */

export const PrintSection = ({ title, children, marginTop = 8, className = "" }) => (
  <div className={`print-section ${className}`.trim()} style={{ marginTop }}>
    <div className="print-section__title">{title}</div>
    {children}
  </div>
);

/* --------------------------------------------------------------------------
   MetaGrid — label/value cells in a responsive grid (info block)
   -------------------------------------------------------------------------- */

export const MetaGrid = ({ items = [], columns, className = "" }) => (
  <div
    className={`print-metagrid ${className}`.trim()}
    style={{ gridTemplateColumns: columns || `repeat(${Math.min(items.length, 6)}, 1fr)` }}
  >
    {items.map((m, idx) => (
      <MetaItem key={idx} label={m.label} value={m.value} />
    ))}
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
  className = "",
}) => {
  const colSpan = columns.length || 1;
  return (
    <table className={`print-table ${className}`.trim()}>
      <thead>
        <tr>
          {columns.map((col, ci) => (
            <th
              key={col.key ?? ci}
              style={{ ...(col.width ? { width: col.width } : {}), textAlign: col.align || "left" }}
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
   Summary — right-aligned label/value totals grid
   rows: [{ label, value, strong?, divider? }]
   -------------------------------------------------------------------------- */

export const Summary = ({ rows = [], className = "" }) => (
  <div className={`print-summary ${className}`.trim()}>
    {rows.flatMap((row, idx) => [
      <span
        key={`l${idx}`}
        className={[
          row.strong ? "print-summary__row--strong" : "",
          row.divider ? "print-summary__row--divider" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {row.label}
      </span>,
      <strong
        key={`v${idx}`}
        className={[
          "print-summary__value",
          row.strong ? "print-summary__row--strong" : "",
          row.divider ? "print-summary__row--divider" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {row.value}
      </strong>,
    ])}
  </div>
);

export default PrintTable;
