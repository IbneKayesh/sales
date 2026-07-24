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
    if (item.parent_id === '-') {
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
export {  buildPaths };
