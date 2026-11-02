function getValue(object, path) {
  return path.split(".").reduce((value, key) => {
    if (value === null || value === undefined) {
      return undefined;
    }

    return value[key];
  }, object);
}

export function matches(document, filter = {}) {
  return Object.entries(filter).every(([key, expected]) => {
    const actual = getValue(document, key);

    return actual === expected;
  });
}

export function sortDocuments(documents, sort = {}) {
  const entries = Object.entries(sort);

  if (!entries.length) {
    return documents;
  }

  return [...documents].sort((a, b) => {
    for (const [field, direction] of entries) {
      const av = getValue(a, field);
      const bv = getValue(b, field);

      if (av === bv) continue;

      if (av === undefined) return 1;
      if (bv === undefined) return -1;

      const comparison =
        av < bv ? -1 : av > bv ? 1 : 0;

      return comparison * (direction === -1 ? -1 : 1);
    }

    return 0;
  });
}