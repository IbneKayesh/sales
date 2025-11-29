const validate = (data, schema) => {
  const errors = {};

  for (const field in schema) {
    const rules = schema[field];
    const value = data[field];

    // -------- REQUIRED CHECK ----------
    if (
      rules.required &&
      (value === undefined || value === null || value === "")
    ) {
      errors[field] = `${rules.name || field} is required.`;
      continue;
    }

    // Skip further validation if field is optional & empty
    if (!rules.required && (value === undefined || value === null || value === "")) {
      continue;
    }

    // -------- TYPE CHECKS ----------
    if (rules.type === "number") {
      // Allow string numbers like "10.25"
      if (isNaN(Number(value))) {
        errors[field] = `${rules.name || field} must be a valid number.`;
        continue;
      }
    } 
    else if (rules.type === "string") {
      if (typeof value !== "string") {
        errors[field] = `${rules.name || field} must be a string.`;
        continue;
      }
    }

    // -------- LENGTH CHECKS ----------
    if (
      rules.minLength &&
      typeof value === "string" &&
      value.length < rules.minLength
    ) {
      errors[field] = `${rules.name || field} must be at least ${rules.minLength} characters long.`;
    }

    if (
      rules.maxLength &&
      typeof value === "string" &&
      value.length > rules.maxLength
    ) {
      errors[field] = `${rules.name || field} must be no more than ${rules.maxLength} characters long.`;
    }

    // -------- DATE VALIDATION ----------
    if (rules.format === "date") {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        errors[field] = `${rules.name || field} must be a valid date.`;
      }
    }

    // -------- CUSTOM VALIDATION ----------
    if (rules.custom && typeof rules.custom === "function") {
      const customError = rules.custom(value);
      if (customError) {
        errors[field] = customError;
      }
    }
  }

  return errors;
};

export default validate;