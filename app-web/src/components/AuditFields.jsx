import React from "react";
import { formatDateTime } from "@/utils/datetime";

import LabelField from "./LabelField";

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
  return (
    <div className="col-12 md:col-2">
      <div style={labelStyle}>{label}</div>
      <LabelField value={value} />
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
        backgroundColor: "var(--surface-3)",
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
