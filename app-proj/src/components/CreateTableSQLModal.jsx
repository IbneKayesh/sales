import { useEffect, useMemo } from "react";
import { useNotification } from "../context/NotificationContext";

function formatCreateTableSQL({ table, columns }) {
  const colsSorted = [...(columns || [])]
    .filter((c) => c.table_id === table.id)
    .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0) || a.id - b.id);

  const defs = colsSorted.map((c) => {
    const type = `${(c.data_type || "").toLowerCase()}${c.length ? `(${c.length})` : ""}`.trim();
    const notNull = c.nullable === false ? " NOT NULL" : "";
    const defaultClause = (c.default_value ?? "").toString().trim()
      ? ` DEFAULT ${(c.default_value ?? "").toString().trim()}`
      : "";
    const pkInline = c.is_primary ? " PRIMARY KEY" : "";
    const fkInline =
      c.is_foreign && c.references_table ? ` REFERENCES ${c.references_table}` : "";

    return `  ${c.column_name} ${type}${notNull}${defaultClause}${pkInline}${fkInline}`;
  });

  return `CREATE TABLE ${table.table_name} (\n${defs.join(",\n")}\n);`;
}

function useClipboardCopy({ text, onSuccess }) {
  return async () => {
    try {
      await navigator.clipboard.writeText(text);
      onSuccess?.();
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      onSuccess?.();
    }
  };
}

export default function CreateTableSQLModal({
  open,
  table,
  columns,
  onClose,
}) {
  const { addNotification } = useNotification();

  const sql = useMemo(() => {
    if (!table) return "";
    return formatCreateTableSQL({ table, columns });
  }, [table, columns]);

  const copy = useClipboardCopy({
    text: sql,
    onSuccess: () => addNotification("CREATE TABLE SQL copied", "success"),
  });

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e) {
      if (e.key === "Escape") onClose?.();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !table) return null;

  // Portaled DOM modal to keep existing styling independent of the app CSS.
  // (This component used the same inline-style approach as the previous implementation.)
  return (
    <div
      style={{
        position: "fixed",
        inset: "0",
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        style={{
          background: "var(--card-bg, #fff)",
          color: "var(--text-primary, #1e293b)",
          border: "1px solid var(--border, #e2e8f0)",
          borderRadius: "12px",
          width: "min(780px, 92vw)",
          maxHeight: "82vh",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          overflow: "hidden",
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "12px 14px",
            borderBottom: "1px solid var(--border, #e2e8f0)",
            background: "var(--panel-bg, #f0f4f9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: "13px",
            }}
          >
            SQL: {table.table_name}
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-xs"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div
          style={{
            padding: "12px 14px 14px",
            overflow: "auto",
          }}
        >
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre",
              overflow: "auto",
              fontFamily: "var(--mono, monospace)",
              fontSize: "12px",
              lineHeight: "1.5",
              padding: "12px",
              border: "1px solid var(--border, #e2e8f0)",
              borderRadius: "10px",
              background: "rgba(14,165,233,0.05)",
            }}
          >
            {sql}
          </pre>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "flex-end",
            padding: "12px 14px",
            borderTop: "1px solid var(--border, #e2e8f0)",
          }}
        >
          <button
            type="button"
            className="btn btn-primary btn-xs"
            onClick={copy}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}

