const parseAttributes = (attrb) => {
  if (!attrb) return {};
  if (typeof attrb === "object") return attrb;
  try {
    return JSON.parse(attrb);
  } catch (e) {
    return {};
  }
};

const stringifyAttributes = (attrb) => {
  if (!attrb) return "{}";
  if (typeof attrb === "object") {
    const filteredAttrb = Object.fromEntries(
      Object.entries(attrb).filter(
        ([_, value]) => value !== "" && value !== null && value !== undefined,
      ),
    );
    return JSON.stringify(filteredAttrb);
  }
  return attrb;
};

export { parseAttributes, stringifyAttributes };
