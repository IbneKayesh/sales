import { currentDate } from "@/utils/datetime";

const validate = (data, schema) => {
  const errors = {};

  for (const field in schema) {
    const rules = schema[field];
    const value = data[field];
    const label = rules.label || field;

    /* ---------------- REQUIRED ---------------- */
    if (
      rules.required &&
      (value === undefined || value === null || value === "")
    ) {
      errors[field] = `${label} is required.`;
      continue;
    }

    // Optional & empty → skip
    if (
      !rules.required &&
      (value === undefined || value === null || value === "")
    ) {
      continue;
    }

    /* ---------------- TYPE VALIDATION ---------------- */
    let numericValue = null;

    switch (rules.type) {
      case "string":
      case "password":
        if (typeof value !== "string") {
          errors[field] = `${label} must be a string.`;
          continue;
        }
        break;

      case "email": {
        if (typeof value !== "string") {
          errors[field] = `${label} must be a valid email.`;
          continue;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[field] = `${label} must be a valid email address.`;
          continue;
        }
        break;
      }

      case "number":
        numericValue = Number(value);
        if (!Number.isInteger(numericValue)) {
          errors[field] = `${label} must be a valid integer.`;
          continue;
        }
        break;

      case "decimal":
        numericValue = Number(value);
        if (isNaN(numericValue)) {
          errors[field] = `${label} must be a valid decimal number.`;
          continue;
        }
        break;

      case "date": {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          errors[field] = `${label} must be a valid date.`;
          continue;
        }
        break;
      }

      default:
        break;
    }

    /* ---------------- STRING LENGTH ---------------- */
    if (
      rules.minLength &&
      typeof value === "string" &&
      value.length < rules.minLength
    ) {
      errors[
        field
      ] = `${label} must be at least ${rules.minLength} characters long.`;
      continue;
    }

    if (
      rules.maxLength &&
      typeof value === "string" &&
      value.length > rules.maxLength
    ) {
      errors[
        field
      ] = `${label} must be no more than ${rules.maxLength} characters long.`;
      continue;
    }

    /* ---------------- NUMBER / DECIMAL RANGE ---------------- */
    if (
      (rules.type === "number" || rules.type === "decimal") &&
      numericValue !== null
    ) {
      if (rules.minLength !== undefined && numericValue < rules.minLength) {
        errors[field] = `${label} must be at least ${rules.minLength}.`;
        continue;
      }

      if (rules.maxLength !== undefined && numericValue > rules.maxLength) {
        errors[field] = `${label} must be no more than ${rules.maxLength}.`;
        continue;
      }
    }

    /* ---------------- PASSWORD STRENGTH ---------------- */
    if (rules.type === "password" && rules.strong) {
      const strongPwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
      if (!strongPwdRegex.test(value)) {
        errors[
          field
        ] = `${label} must include uppercase, lowercase, number, and special character.`;
        continue;
      }
    }

    /* ---------------- CUSTOM VALIDATION ---------------- */
    if (rules.custom && typeof rules.custom === "function") {
      const customError = rules.custom(value, data);
      if (customError) {
        errors[field] = customError;
      }
    }
  }

  return errors;
};

export const generateDataModel_v1 = (schema, extraData = {}) => {
  return Object.keys(schema).reduce((acc, key) => {
    if (schema[key].default === "new Date() with local format") {
      acc[key] = currentDate();
    } else {
      acc[key] = schema[key].default || "";
    }
    return acc;
  }, extraData);
};

export const generateDataModel = (schema, extraData = {}) => {
  return Object.keys(schema).reduce((acc, key) => {
    const def = schema[key].default;

    if (def === "new Date() with local format") {
      acc[key] = currentDate();
    } else if (def !== undefined) {
      // accept 0, false, "", numbers, strings
      acc[key] = def;
    } else {
      acc[key] = "";
    }

    return acc;
  }, extraData);
};

export default validate;