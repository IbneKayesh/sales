/**
 * Validation + payload normalization aligned with scripts/*.sql
 * (NOT NULL columns, VARCHAR limits, INT/DATE/BOOLEAN coercion).
 */

const COLUMN_DATA_TYPES = [
  "VARCHAR",
  "INTEGER",
  "DATE",
  "TIMESTAMP",
  "BOOLEAN",
  "DECIMAL",
];

const FEATURE_TYPES = new Set(["project", "module", "submodule", "feature"]);

const LIMITS = {
  table_name: 255,
  column_name: 255,
  data_type: 50,
  default_value: 255,
  references_table: 50,
  references_column: 50,
  feature_type: 50,
  feature_name: 255,
  feature_status: 20,
  feature_priority: 20,
  work_type: 20,
  work_user: 50,
  task_name: 255,
};

const isBlank = (value) => {
  const s = String(value ?? "").trim();
  return s === "" || s === "-";
};

const toOptionalText = (value) => (isBlank(value) ? null : String(value).trim());

const requireText = (value, label, { maxLength } = {}) => {
  if (isBlank(value)) {
    return { error: `Please enter ${label}.` };
  }
  const text = String(value).trim();
  if (maxLength && text.length > maxLength) {
    return {
      error: `${label} must be at most ${maxLength} characters.`,
    };
  }
  return { value: text };
};

const parseOptionalInt = (value, label, { min } = {}) => {
  if (isBlank(value)) {
    return { value: null };
  }
  const num = Number(value);
  if (!Number.isFinite(num) || !Number.isInteger(num)) {
    return { error: `${label} must be a whole number.` };
  }
  if (min !== undefined && num < min) {
    return { error: `${label} must be at least ${min}.` };
  }
  return { value: num };
};

const parseOptionalIntDefault = (value, defaultValue, label, { min, max } = {}) => {
  if (isBlank(value)) {
    return { value: defaultValue };
  }
  const num = Number(value);
  if (!Number.isFinite(num) || !Number.isInteger(num)) {
    return { error: `${label} must be a whole number.` };
  }
  if (min !== undefined && num < min) {
    return { error: `${label} must be at least ${min}.` };
  }
  if (max !== undefined && num > max) {
    return { error: `${label} must be at most ${max}.` };
  }
  return { value: num };
};

const toOptionalDate = (value, label) => {
  if (isBlank(value)) {
    return { value: null };
  }
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) {
    return { error: `Please enter a valid ${label}.` };
  }
  return { value: d.toISOString().split("T")[0] };
};

const parseBoolean = (value, defaultValue) => {
  if (value === undefined || value === null) {
    return defaultValue;
  }
  return Boolean(value);
};

/** t_tables — NOT NULL: table_name */
export const prepareTablePayload = (data) => {
  const name = requireText(data?.table_name, "a table name", {
    maxLength: LIMITS.table_name,
  });
  if (name.error) {
    return { error: name.error };
  }

  const serial = parseOptionalInt(data?.serial_number, "Serial number");
  if (serial.error) {
    return { error: serial.error };
  }

  return {
    payload: {
      id: data?.id || "",
      table_name: name.value,
      table_description: toOptionalText(data?.table_description),
      serial_number: serial.value,
    },
  };
};

/** t_columns — NOT NULL: table_id, column_name, data_type */
export const prepareColumnPayload = (data, tableId) => {
  if (isBlank(tableId)) {
    return { error: "Please save the table before adding columns." };
  }

  const columnName = requireText(data?.column_name, "a column name", {
    maxLength: LIMITS.column_name,
  });
  if (columnName.error) {
    return { error: columnName.error };
  }

  const dataType = requireText(data?.data_type, "a data type", {
    maxLength: LIMITS.data_type,
  });
  if (dataType.error) {
    return { error: dataType.error };
  }
  if (!COLUMN_DATA_TYPES.includes(dataType.value)) {
    return { error: "Please select a valid data type." };
  }

  const serial = parseOptionalInt(data?.serial_number, "Serial number");
  if (serial.error) {
    return { error: serial.error };
  }

  const dataLength = parseOptionalInt(data?.data_length, "Length", { min: 1 });
  if (dataLength.error) {
    return { error: dataLength.error };
  }

  const isForeign = parseBoolean(data?.is_foreign, false);
  let referencesTable = toOptionalText(data?.references_table);
  let referencesColumn = toOptionalText(data?.references_column);

  if (isForeign) {
    if (isBlank(referencesTable)) {
      return { error: "Please enter a reference table when FK is enabled." };
    }
    if (isBlank(referencesColumn)) {
      return { error: "Please enter a reference column when FK is enabled." };
    }
    if (referencesTable.length > LIMITS.references_table) {
      return {
        error: `Reference table must be at most ${LIMITS.references_table} characters.`,
      };
    }
    if (referencesColumn.length > LIMITS.references_column) {
      return {
        error: `Reference column must be at most ${LIMITS.references_column} characters.`,
      };
    }
  } else {
    referencesTable = null;
    referencesColumn = null;
  }

  const defaultValue = toOptionalText(data?.default_value);
  if (defaultValue && defaultValue.length > LIMITS.default_value) {
    return {
      error: `Default value must be at most ${LIMITS.default_value} characters.`,
    };
  }

  return {
    payload: {
      id: data?.id || "",
      table_id: String(tableId).trim(),
      column_name: columnName.value,
      data_type: dataType.value,
      data_length: dataLength.value,
      is_nullable: parseBoolean(data?.is_nullable, true),
      default_value: defaultValue,
      is_primary: parseBoolean(data?.is_primary, false),
      is_foreign: isForeign,
      references_table: referencesTable,
      references_column: referencesColumn,
      column_description: toOptionalText(data?.column_description),
      serial_number: serial.value,
    },
  };
};

/** t_features — NOT NULL: feature_type, feature_name, feature_status, feature_priority, work_type, work_user */
export const prepareFeaturePayload = (data) => {
  const featureName = requireText(data?.feature_name, "a feature name", {
    maxLength: LIMITS.feature_name,
  });
  if (featureName.error) {
    return { error: featureName.error };
  }

  const featureType = requireText(data?.feature_type, "a feature type", {
    maxLength: LIMITS.feature_type,
  });
  if (featureType.error) {
    return { error: featureType.error };
  }
  if (!FEATURE_TYPES.has(featureType.value)) {
    return { error: "Please select a valid feature type." };
  }

  const parentId = toOptionalText(data?.feature_id);
  if (featureType.value !== "project" && !parentId) {
    return { error: "Parent feature is required for this type." };
  }
  if (featureType.value === "project" && parentId) {
    return { error: "Projects cannot have a parent feature." };
  }

  const status = requireText(data?.feature_status, "a status", {
    maxLength: LIMITS.feature_status,
  });
  if (status.error) {
    return { error: status.error };
  }

  const priority = requireText(data?.feature_priority, "a priority", {
    maxLength: LIMITS.feature_priority,
  });
  if (priority.error) {
    return { error: priority.error };
  }

  const workType = requireText(data?.work_type, "a work type", {
    maxLength: LIMITS.work_type,
  });
  if (workType.error) {
    return { error: workType.error };
  }

  const workUser = requireText(data?.work_user, "a work user", {
    maxLength: LIMITS.work_user,
  });
  if (workUser.error) {
    return { error: workUser.error };
  }

  const serial = parseOptionalInt(data?.serial_number, "Serial number");
  if (serial.error) {
    return { error: serial.error };
  }

  const progress = parseOptionalIntDefault(
    data?.progress_percent,
    0,
    "Progress",
    { min: 0, max: 100 },
  );
  if (progress.error) {
    return { error: progress.error };
  }

  const startDate = toOptionalDate(data?.start_date, "start date");
  if (startDate.error) {
    return { error: startDate.error };
  }

  const endDate = toOptionalDate(data?.end_date, "end date");
  if (endDate.error) {
    return { error: endDate.error };
  }

  if (startDate.value && endDate.value && startDate.value > endDate.value) {
    return { error: "End date cannot be before start date." };
  }

  return {
    payload: {
      id: data?.id || "",
      feature_id: featureType.value === "project" ? null : parentId,
      feature_type: featureType.value,
      feature_name: featureName.value,
      feature_description: toOptionalText(data?.feature_description),
      feature_status: status.value,
      feature_priority: priority.value,
      work_type: workType.value,
      work_user: workUser.value,
      start_date: startDate.value,
      end_date: endDate.value,
      progress_percent: progress.value,
      serial_number: serial.value,
    },
  };
};

/** t_feature_table — NOT NULL: feature_id, table_id */
export const prepareFeatureTablePayload = (featureId, tableId) => {
  if (isBlank(featureId)) {
    return { error: "Please save the feature before linking a table." };
  }
  if (isBlank(tableId)) {
    return { error: "Please select a table to link." };
  }

  return {
    payload: {
      feature_id: String(featureId).trim(),
      table_id: String(tableId).trim(),
    },
  };
};

/** t_task — NOT NULL: feature_id, task_name */
export const prepareTaskPayload = (data, featureId) => {
  const resolvedFeatureId = featureId ?? data?.feature_id;
  if (isBlank(resolvedFeatureId)) {
    return { error: "Feature is required for a task." };
  }

  const taskName = requireText(data?.task_name, "a task name", {
    maxLength: LIMITS.task_name,
  });
  if (taskName.error) {
    return { error: taskName.error };
  }

  return {
    payload: {
      id: data?.id || "",
      feature_id: String(resolvedFeatureId).trim(),
      task_name: taskName.value,
      is_done: parseBoolean(data?.is_done, false),
    },
  };
};

/** t_task edit — API expects id, task_name, is_done */
export const prepareTaskEditPayload = (task, isDone) => {
  const prepared = prepareTaskPayload(
    { ...task, is_done: isDone },
    task?.feature_id,
  );
  if (prepared.error) {
    return prepared;
  }

  return {
    payload: {
      id: prepared.payload.id,
      task_name: prepared.payload.task_name,
      is_done: prepared.payload.is_done,
    },
  };
};
