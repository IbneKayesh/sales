const API = "/api";

async function request(url, options = {}) {
  const response = await fetch(`${API}${url}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  let result;
  try { result = await response.json(); }
  catch { throw new Error(`HTTP ${response.status}`); }

  if (!response.ok) throw new Error(result.error || "Request failed");
  return result;
}

export const filebase = {
  // Documents
  find: (collection, filter = {}, sort = { createdAt: -1 }, limit = 1000, offset = 0) =>
    request(`/${collection}?filter=${encodeURIComponent(JSON.stringify(filter))}&sort=${encodeURIComponent(JSON.stringify(sort))}&limit=${limit}&offset=${offset}`),

  findById: (collection, id) => request(`/${collection}/${id}`),

  count: (collection, filter = {}) =>
    request(`/${collection}/count?filter=${encodeURIComponent(JSON.stringify(filter))}`),

  insert: (collection, data) =>
    request(`/${collection}`, { method: "POST", body: JSON.stringify(data) }),

  update: (collection, id, data) =>
    request(`/${collection}/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  delete: (collection, id) =>
    request(`/${collection}/${id}`, { method: "DELETE" }),

  // Collections
  listCollections: () => request("/collections"),
  createCollection: (name) =>
    request("/collections", { method: "POST", body: JSON.stringify({ name }) }),
  dropCollection: (name) =>
    request(`/collections/${name}`, { method: "DELETE" }),
};