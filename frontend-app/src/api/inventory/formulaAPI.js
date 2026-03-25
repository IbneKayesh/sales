import { apiRequest } from "@/utils/api.js";

// formulaAPI
export const formulaAPI = {
  getByItem: (data) =>
    apiRequest("/inventory/products/formula/get-by-item", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/inventory/products/formula/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/inventory/products/formula/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/inventory/products/formula/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
