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
    if (item.parent_id === null) {
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
  }));
};

const test = () => {
  const data = [
    { id: 1, name: "Assets", parent_id: null },
    { id: 2, name: "Inventory", parent_id: 1 },
    { id: 3, name: "Good Stock", parent_id: 2 },
    { id: 4, name: "Bad Stock", parent_id: 2 },
    { id: 5, name: "Cash", parent_id: 1 },
    { id: 6, name: "Petty Cash", parent_id: 5 },
    { id: 7, name: "Bank", parent_id: 1 },
    { id: 8, name: "Current", parent_id: 7 },
    { id: 9, name: "Loan", parent_id: 7 },
    { id: 10, name: "FDR", parent_id: 7 },
  ];

  console.log(buildPaths(data));

  // [
  //   { id: 1, name: "Assets" },
  //   { id: 2, name: "Assets > Inventory" },
  //   { id: 3, name: "Assets > Inventory > Good Stock" },
  //   { id: 4, name: "Assets > Inventory > Bad Stock" },
  //   { id: 5, name: "Assets > Cash" },
  //   { id: 6, name: "Assets > Cash > Petty Cash" },
  //   { id: 7, name: "Assets > Bank" },
  //   { id: 8, name: "Assets > Bank > Current" },
  //   { id: 9, name: "Assets > Bank > Loan" },
  //   { id: 10, name: "Assets > Bank > FDR" }
  // ]
};
export { test, buildPaths };
