/**
 * Validates form data against a JSON schema model definition.
 *
 * @param {Object} data       - The form data to validate (flat key-value pairs).
 * @param {Object} model      - The model definition from a JSON schema file (e.g. products.json).
 * @param {Object} [options]
 * @param {boolean} [options.trimStrings=true] - Whether to trim string values before checking length.
 * @returns {Object} errors   - Keyed by field name with error message strings. Empty object = valid.
 */
export function validateModel(data, model, options = {}) {
  const { trimStrings = true, models = {} } = options;
  const errors = {};
  const fields = model || {};

  for (const [fieldName, def] of Object.entries(fields)) {
    const rawValue = data[fieldName];
    const value =
      trimStrings && typeof rawValue === "string" ? rawValue.trim() : rawValue;

    // ── Required check ──────────────────────────────────────────────────
    if (def.required) {
      if (value === undefined || value === null || value === "") {
        errors[fieldName] =
          def.errorMessage || `${def.label || fieldName} is required`;
        continue;
      }
    } else {
      // Optional empty field — skip further validation unless it has a value
      if (value === undefined || value === null || value === "") {
        continue;
      }
    }

    // ── Resolve base type ──────────────────────────────────────────────
    const { resolvedType } = resolveType(def.type);

    // ── Type-specific validation ────────────────────────────────────────
    switch (resolvedType) {
      // ──────────────── STRING FAMILY ──────────────────────────────────
      case "string": {
        const strVal = String(value);

        if (def.enum && !def.enum.includes(strVal)) {
          errors[fieldName] = `Must be one of: ${def.enum.join(", ")}`;
          break;
        }

        if (def.minLength != null && strVal.length < def.minLength) {
          errors[fieldName] =
            `Minimum ${def.minLength} character${def.minLength > 1 ? "s" : ""} required`;
          break;
        }

        if (def.maxLength != null && strVal.length > def.maxLength) {
          errors[fieldName] =
            `Maximum ${def.maxLength} character${def.maxLength > 1 ? "s" : ""}`;
          break;
        }

        // Apply built-in pattern for sub-types if no custom pattern
        const pattern = def.pattern || getBuiltInPattern(def.type);
        if (pattern && !new RegExp(pattern).test(strVal)) {
          errors[fieldName] =
            def.patternMessage || getDefaultPatternMessage(def.type);
        }
        break;
      }

      // ──────────────── NUMBER FAMILY ──────────────────────────────────
      case "number": {
        const numVal = Number(value);

        if (isNaN(numVal)) {
          errors[fieldName] = def.errorMessage || "Must be a valid number";
          break;
        }

        // Integer check
        if (def.type === "integer" && !Number.isInteger(numVal)) {
          errors[fieldName] = "Must be a whole number";
          break;
        }

        // Min/Max
        if (def.min != null && numVal < def.min) {
          errors[fieldName] = `Must be at least ${def.min}`;
          break;
        }

        if (def.max != null && numVal > def.max) {
          errors[fieldName] = `Must be at most ${def.max}`;
          break;
        }

        // Decimal precision check
        if (def.type === "decimal" && def.precision != null) {
          const parts = String(numVal).split(".");
          const decimalPlaces = parts[1] ? parts[1].length : 0;
          if (decimalPlaces > def.precision) {
            errors[fieldName] =
              `At most ${def.precision} decimal place${def.precision > 1 ? "s" : ""} allowed`;
            break;
          }
        }
        break;
      }

      // ──────────────── DATE / TIME FAMILY ─────────────────────────────
      case "date": {
        if (!isValidDate(value)) {
          errors[fieldName] = "Must be a valid date (YYYY-MM-DD)";
          break;
        }

        const dateVal = new Date(value + "T00:00:00");
        if (def.min) {
          const minDate = new Date(def.min + "T00:00:00");
          if (dateVal < minDate) {
            errors[fieldName] = `Must be on or after ${def.min}`;
            break;
          }
        }
        if (def.max) {
          const maxDate = new Date(def.max + "T00:00:00");
          if (dateVal > maxDate) {
            errors[fieldName] = `Must be on or before ${def.max}`;
            break;
          }
        }
        break;
      }

      case "datetime":
      case "datetime-local": {
        if (!isValidDatetime(value)) {
          errors[fieldName] = "Must be a valid date and time";
          break;
        }

        const dtVal = new Date(value);
        if (def.min && new Date(def.min) > dtVal) {
          errors[fieldName] = `Must be on or after ${def.min}`;
          break;
        }
        if (def.max && new Date(def.max) < dtVal) {
          errors[fieldName] = `Must be on or before ${def.max}`;
          break;
        }
        break;
      }

      case "time": {
        if (!isValidTime(value)) {
          errors[fieldName] = "Must be a valid time (HH:MM or HH:MM:SS)";
          break;
        }
        // Time comparison could be added with def.minTime / def.maxTime
        break;
      }

      // ──────────────── BOOLEAN ────────────────────────────────────────
      case "boolean": {
        if (value !== true && value !== false) {
          errors[fieldName] = "Must be true or false";
        }
        break;
      }

      // ──────────────── ARRAY ──────────────────────────────────────────
      case "array": {
        if (!Array.isArray(value)) {
          errors[fieldName] = "Must be an array";
          break;
        }

        if (def.minItems != null && value.length < def.minItems) {
          errors[fieldName] =
            `At least ${def.minItems} item${def.minItems > 1 ? "s" : ""} required`;
          break;
        }

        if (def.maxItems != null && value.length > def.maxItems) {
          errors[fieldName] =
            `At most ${def.maxItems} item${def.maxItems > 1 ? "s" : ""} allowed`;
          break;
        }

        // Resolve item model (inline itemModel or via itemModelRef)
        const itemModel =
          def.itemModel || (def.itemModelRef && models[def.itemModelRef]);

        // Validate each item in the array against itemModel
        if (itemModel && value.length > 0) {
          value.forEach((item, idx) => {
            for (const [itemField, itemDef] of Object.entries(itemModel)) {
              const itemRaw = item[itemField];
              const itemVal =
                trimStrings && typeof itemRaw === "string"
                  ? itemRaw.trim()
                  : itemRaw;
              const itemResolved = resolveType(itemDef.type);

              if (itemDef.required) {
                if (
                  itemVal === undefined ||
                  itemVal === null ||
                  itemVal === ""
                ) {
                  if (!errors[`${fieldName}[${idx}].${itemField}`]) {
                    errors[`${fieldName}[${idx}].${itemField}`] =
                      itemDef.errorMessage ||
                      `${itemDef.label || itemField} is required`;
                  }
                  continue;
                }
              } else if (
                itemVal === undefined ||
                itemVal === null ||
                itemVal === ""
              ) {
                continue;
              }

              if (itemResolved.resolvedType === "string") {
                const strVal = String(itemVal);
                if (itemDef.enum && !itemDef.enum.includes(strVal)) {
                  errors[`${fieldName}[${idx}].${itemField}`] =
                    `Must be one of: ${itemDef.enum.join(", ")}`;
                } else if (
                  itemDef.minLength != null &&
                  strVal.length < itemDef.minLength
                ) {
                  errors[`${fieldName}[${idx}].${itemField}`] =
                    `Minimum ${itemDef.minLength} characters`;
                } else if (
                  itemDef.maxLength != null &&
                  strVal.length > itemDef.maxLength
                ) {
                  errors[`${fieldName}[${idx}].${itemField}`] =
                    `Maximum ${itemDef.maxLength} characters`;
                }
              } else if (itemResolved.resolvedType === "number") {
                const numVal = Number(itemVal);
                if (isNaN(numVal)) {
                  errors[`${fieldName}[${idx}].${itemField}`] =
                    itemDef.errorMessage || "Must be a valid number";
                } else if (
                  itemDef.type === "integer" &&
                  !Number.isInteger(numVal)
                ) {
                  errors[`${fieldName}[${idx}].${itemField}`] =
                    "Must be a whole number";
                } else if (itemDef.min != null && numVal < itemDef.min) {
                  errors[`${fieldName}[${idx}].${itemField}`] =
                    `Must be at least ${itemDef.min}`;
                } else if (itemDef.max != null && numVal > itemDef.max) {
                  errors[`${fieldName}[${idx}].${itemField}`] =
                    `Must be at most ${itemDef.max}`;
                }
              }
            }
          });
        }
        break;
      }

      default:
        break;
    }
  }

  return errors;
}

// ── Helper: resolve type into base type ──────────────────────────────────
function resolveType(type) {
  const stringSubTypes = ["text", "email", "url", "tel", "password", "color"];
  const numberSubTypes = ["integer", "decimal"];

  if (stringSubTypes.includes(type)) {
    return { resolvedType: "string" };
  }
  if (numberSubTypes.includes(type)) {
    return { resolvedType: "number" };
  }
  return { resolvedType: type };
}

// ── Built-in regex patterns for sub-types ────────────────────────────────
function getBuiltInPattern(type) {
  switch (type) {
    case "email":
      return "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";
    case "url":
      return "^(https?:\\/\\/)?([\\w\\-]+\\.)+[\\w\\-]+(\\/[\\w\\-./?%&=]*)?$";
    case "color":
      return "^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$";
    case "tel":
      return null; // too many formats, skip built-in
    default:
      return null;
  }
}

function getDefaultPatternMessage(type) {
  switch (type) {
    case "email":
      return "Must be a valid email address";
    case "url":
      return "Must be a valid URL";
    case "color":
      return "Must be a valid hex color (e.g. #ff0000)";
    default:
      return "Invalid format";
  }
}

// ── Date/time validators ─────────────────────────────────────────────────
function isValidDate(value) {
  if (typeof value !== "string" || !value) return false;
  // Accept YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(value)) return false;
  const d = new Date(value + "T00:00:00");
  return !isNaN(d.getTime()) && d.toISOString().startsWith(value);
}

function isValidDatetime(value) {
  if (typeof value !== "string" || !value) return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

function isValidTime(value) {
  if (typeof value !== "string" || !value) return false;
  // Accept HH:MM or HH:MM:SS
  return /^\d{2}:\d{2}(:\d{2})?$/.test(value);
}

/**
 * Applies default values from the model to an empty form object.
 *
 * @param {Object} model - The model definition.
 * @returns {Object} form defaults.
 */
export function getFormDefaults(model) {
  const defaults = {};
  for (const [fieldName, def] of Object.entries(model || {})) {
    defaults[fieldName] = def.default !== undefined ? def.default : "";
  }
  return defaults;
}
