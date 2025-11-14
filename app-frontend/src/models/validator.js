const validate = (data, schema) => {
  const errors = {};

  for (const field in schema) {
    const rules = schema[field];
    const value = data[field];

    if (
      rules.required &&
      (value === undefined || value === null || value === "")
    ) {
      errors[field] = `${rules.name || field} is required.`;
      continue;
    }

    if (rules.type) {
      const type = typeof value;
      if (type !== rules.type) {
        errors[field] = `${rules.name || field} must be of type ${rules.type}.`;
        continue;
      }
    }

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
