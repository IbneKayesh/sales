export const formatColumnType = (col) => {
  const type = col.data_type || "";
  return col.data_length ? `${type}(${col.data_length})` : type;
};

export const formatColumnTooltip = (col) => {
  const lines = [
    col.column_name,
    `Type: ${formatColumnType(col)}`,
    `Nullable: ${col.is_nullable === false ? "No" : "Yes"}`,
  ];
  if (col.default_value) lines.push(`Default: ${col.default_value}`);
  if (col.is_primary) lines.push("Primary Key");
  if (col.is_foreign) {
    const ref =
      col.references_table && col.references_column
        ? `${col.references_table}.${col.references_column}`
        : "";
    lines.push(`Foreign Key${ref ? ` → ${ref}` : ""}`);
  }
  if (col.column_description) lines.push(col.column_description);
  return lines.join("\n");
};
