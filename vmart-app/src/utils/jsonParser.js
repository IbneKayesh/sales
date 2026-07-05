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

function buildCoaTree(items, parent = "-", controls = true) {
  return items
    ?.filter((item) => item.chtac_chtac === parent)
    .map((item) => ({
      key: item.id,
      label: `${item.chtac_chtno} - ${item.chtac_cname}`,
      data: item,
      selectable: item.chtac_ispst === controls,
      children: buildCoaTree(items, item.id, controls),
    }));
}
function findCoaTree(nodes, id) {
  for (const node of nodes || []) {
    if (node.data?.id === id) return node;

    if (node.children?.length) {
      const found = findCoaTree(node.children, id);
      if (found) return found;
    }
  }
  return null;
}
export { parseAttributes, stringifyAttributes, buildCoaTree, findCoaTree };
