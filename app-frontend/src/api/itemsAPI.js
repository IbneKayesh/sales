import { apiRequest } from "@/utils/api.js";

// Items API
export const itemsAPI = {
  getAll: (filter = "default") => apiRequest(`/items?filter=${filter}`),
  getById: (id) => apiRequest(`/items/${id}`),
  create: (item) =>
    apiRequest("/items", {
      method: "POST",
      body: JSON.stringify(item),
    }),
  update: (id, item) =>
    apiRequest("/items/update", {
      method: "POST",
      body: JSON.stringify({ id, ...item }),
    }),
  delete: (id) =>
    apiRequest("/items/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
};
