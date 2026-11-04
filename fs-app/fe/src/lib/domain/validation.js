/**
 * Validates a form payload against its model/bank.json-style definition.
 * Returns a field -> message map ready for the form `Field` error prop.
 */
export function validateRecord(model, values) {
  const errors = {};

  for (const field of model?.fields ?? []) {
    const value = values?.[field.name];
    const empty =
      value === undefined ||
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0);

    if (field.required && empty) {
      errors[field.name] = `${field.label || field.name} is required`;
      continue;
    }

    if (empty) continue;

    if (field.type === "number") {
      if (Number.isNaN(Number(value))) {
        errors[field.name] = `${field.label || field.name} must be a number`;
        continue;
      }

      if (field.min !== undefined && Number(value) < field.min) {
        errors[field.name] = `${field.label || field.name} must be at least ${field.min}`;
        continue;
      }
    }

    if (
      (field.type === "string" || field.type === "date") &&
      typeof value !== "string"
    ) {
      errors[field.name] = `${field.label || field.name} must be text`;
      continue;
    }

    if (
      typeof value === "string" &&
      field.maxLength &&
      value.length > field.maxLength
    ) {
      errors[field.name] =
        `${field.label || field.name} must be at most ${field.maxLength} characters`;
      continue;
    }

    if (field.type === "enum" && field.values && !field.values.includes(value)) {
      errors[field.name] =
        `${field.label || field.name} must be one of: ${field.values.join(", ")}`;
    }
  }

  return errors;
}
