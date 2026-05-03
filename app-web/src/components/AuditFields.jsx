import React from "react";
import { formatDateTime } from "@/utils/datetime";

const normalise = (value) => {
  if (value === null || value === undefined || value === "") return undefined;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return String(value);
  return value;
};

/**
 * AuditFields — read-only audit info section.
 * Renders a bordered separator + 6 labelled fields.
 *
 * Props:
 *   active     boolean – record active flag
 *   createdBy  string  – creator user name
 *   createdAt  string  – creation datetime (raw)
 *   updatedBy  string  – last updater user name
 *   updatedAt  string  – last update datetime (raw)
 *   revNo      number  – revision / version number
 */

const labelStyle = {
  fontSize: "0.8rem",
  fontWeight: 700,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "var(--text-danger)",
  marginBottom: "0.15rem",
};

const AuditField = ({ label, value }) => {
  const display = normalise(value);
  const isEmpty = display === undefined;

  return (
    <div className="col-12 md:col-2">
      <div style={labelStyle}>{label}</div>
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
    </div>
  );
};

const AuditFields = ({
  active,
  createdBy,
  createdAt,
  updatedBy,
  updatedAt,
  revNo,
}) => (
  <>
    {/* ── separator ── */}
    <div
      className="col-12"
      style={{
        borderTop: "1px solid var(--border-strong)",
        paddingTop: "0.5rem",
        marginTop: "0.25rem",
      }}
    >
      <span style={labelStyle}>Record Info</span>
    </div>

    <AuditField label="Active" value={active} />
    <AuditField label="Created By" value={createdBy} />
    <AuditField label="Created At" value={formatDateTime(createdAt)} />
    <AuditField label="Updated By" value={updatedBy} />
    <AuditField label="Updated At" value={formatDateTime(updatedAt)} />
    <AuditField label="Rev No" value={revNo} />
  </>
);

export default AuditFields;
