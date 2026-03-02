import { apiRequest } from "@/utils/api.js";

// brandsAPI
export const brandsAPI = {
  getAll: (data) =>
    apiRequest("/inventory/brands", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/inventory/brands/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/inventory/brands/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/inventory/brands/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAllActive: (data) =>
    apiRequest("/inventory/brands/get-all-active", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
