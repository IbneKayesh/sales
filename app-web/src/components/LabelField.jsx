import React from "react";

const normalise = (value) => {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return String(value);
  if (value instanceof Date) return value.toLocaleString();
  
  if (typeof value === "string") {
    // Basic check for common ISO date strings
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      const parsedDate = new Date(value);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate.toLocaleString();
      }
    }
  }
  return value;
};

const LabelField = ({ value }) => {
  const display = normalise(value);
  const isEmpty = display === undefined;

  return (
    <div
      style={{
        fontSize: "0.92rem",
        fontWeight: 500,
        color: "var(--text-main)",
        padding: "0.45rem 0",
        borderBottom: "1px dashed var(--border-strong)",
        minHeight: "2rem",
        display: "flex",
        alignItems: "center",
      }}
    >
      {!isEmpty ? (
        display
      ) : (
        <span style={{ color: "var(--text-muted, #cbd5e1)" }}>—</span>
      )}
    </div>
  );
};

export default LabelField;