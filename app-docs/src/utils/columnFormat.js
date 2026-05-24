export const formatColumnType = (col) => {
  const type = col.data_type || "";
  return col.data_length ? `${type}(${col.data_length})` : type;
};

export const resolveRefTableName = (refTableId, tablesById = {}) => {
  if (!refTableId) return "";
  const table = tablesById[refTableId];
  return table?.table_name ?? refTableId;
};

export const resolveRefColumnName = (refColumnId, columnsById = {}) => {
  if (!refColumnId) return "";
  const column = columnsById[refColumnId];
  return column?.column_name ?? refColumnId;
};

export const formatForeignKeyRef = (col, lookup = {}) => {
  if (!col?.is_foreign) return "";
  const { tablesById = {}, columnsById = {} } = lookup;
  const table = resolveRefTableName(col.references_table, tablesById);
  const column = resolveRefColumnName(col.references_column, columnsById);
  if (table && column) return `${table}.${column}`;
  if (table) return table;
  return "";
};

export const formatForeignKeyTitle = (col, lookup = {}) => {
  const ref = formatForeignKeyRef(col, lookup);
  return ref ? `Foreign Key → ${ref}` : "Foreign Key";
};

export const formatColumnTooltip = (col, lookup = {}) => {
  const lines = [
    col.column_name,
    `Type: ${formatColumnType(col)}`,
    `Nullable: ${col.is_nullable === false ? "No" : "Yes"}`,
  ];
  if (col.default_value) lines.push(`Default: ${col.default_value}`);
  if (col.is_primary) lines.push("Primary Key");
  if (col.is_foreign) {
    const ref = formatForeignKeyRef(col, lookup);
    lines.push(`Foreign Key${ref ? ` → ${ref}` : ""}`);
  }
  if (col.column_description) lines.push(col.column_description);
  return lines.join("\n");
};
