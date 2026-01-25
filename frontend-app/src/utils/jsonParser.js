const parseAttributes = (attrb) => {
  if (!attrb) return {};
  if (typeof attrb === "object") return attrb;
  try {
    return JSON.parse(attrb);
  } catch (e) {
    return {};
  }
};

export { parseAttributes };
