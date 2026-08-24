const buildPaths = (items) => {
  // Create a lookup map for O(1) access
  const map = new Map(items.map((item) => [item.id, item]));

  // Cache paths to avoid recalculating
  const cache = new Map();

  function getPath(id) {
    if (cache.has(id)) return cache.get(id);

    const item = map.get(id);
    if (!item) return "";

    let path;
    if (item.parent_id === "-") {
      path = item.name;
    } else {
      path = `${getPath(item.parent_id)} > ${item.name}`;
    }

    cache.set(id, path);
    return path;
  }

  return items.map((item) => ({
    id: item.id,
    name: getPath(item.id),
    active: item.active,
  }));
};

function buildPathsCOA(list) {
  const byId = new Map(list.map((row) => [String(row.id), row]));
  const pathList = list.map((row) => {
    const path = [];
    let current = row;
    const visited = new Set();

    while (current) {
      // Protect against circular parent relationships
      if (visited.has(String(current.id))) {
        break;
      }

      visited.add(String(current.id));
      path.unshift(current.chtac_cname);

      if (current.chtac_chtac === "-") {
        break;
      }

      current = byId.get(String(current.chtac_chtac));
    }

    return {
      id: row.id,
      chtac_chtac: row.chtac_chtac,
      chtac_cname: path.join(" > "),
      chtac_chtno: row.chtac_chtno,
      chtac_ntype: row.chtac_ntype,
      chtac_sglmd: row.chtac_sglmd,
      chtac_pstmd: row.chtac_pstmd,
      party_count: row.party_count
    };
  });

  //console.log("pathList", pathList);
  return pathList;
}
export { buildPaths, buildPathsCOA };
