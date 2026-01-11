import { apiRequest } from '@/utils/api.js';

// Categories API
export const categoriesAPI = {
  getAll: (data) =>
    apiRequest("/inventory/categories", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/inventory/categories/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/inventory/categories/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/inventory/categories/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};