/** Coerce request body values to DB-safe types (matches scripts/*.sql). */

const isBlank = (v) => v === undefined || v === null || String(v).trim() === "";

export const toNullIfBlank = (v) => (isBlank(v) ? null : String(v).trim());

export const toIntOrNull = (v) => {
  if (isBlank(v)) return null;
  const n = Number(v);
  return Number.isInteger(n) ? n : null;
};

export const toDateOrNull = (v) => {
  if (isBlank(v)) return null;
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().split("T")[0];
};

export const normalizeTableBody = (body) => ({
  id: body.id,
  table_name: toNullIfBlank(body.table_name),
  table_description: toNullIfBlank(body.table_description),
  serial_number: toIntOrNull(body.serial_number),
});

export const normalizeColumnBody = (body) => ({
  id: body.id,
  table_id: toNullIfBlank(body.table_id),
  column_name: toNullIfBlank(body.column_name),
  data_type: toNullIfBlank(body.data_type),
  data_length: toIntOrNull(body.data_length),
  is_nullable: body.is_nullable ?? true,
  default_value: toNullIfBlank(body.default_value),
  is_primary: body.is_primary ?? false,
  is_foreign: body.is_foreign ?? false,
  references_table: toNullIfBlank(body.references_table),
  references_column: toNullIfBlank(body.references_column),
  column_description: toNullIfBlank(body.column_description),
  serial_number: toIntOrNull(body.serial_number),
});

export const normalizeFeatureBody = (body) => ({
  id: body.id,
  feature_id: toNullIfBlank(body.feature_id),
  feature_type: toNullIfBlank(body.feature_type),
  feature_name: toNullIfBlank(body.feature_name),
  feature_description: toNullIfBlank(body.feature_description),
  feature_status: toNullIfBlank(body.feature_status),
  feature_priority: toNullIfBlank(body.feature_priority),
  work_type: toNullIfBlank(body.work_type),
  work_user: toNullIfBlank(body.work_user),
  start_date: toDateOrNull(body.start_date),
  end_date: toDateOrNull(body.end_date),
  progress_percent: toIntOrNull(body.progress_percent) ?? 0,
  serial_number: toIntOrNull(body.serial_number),
});
