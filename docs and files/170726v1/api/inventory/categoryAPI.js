import { apiRequest } from "@/utils/api.js";

//categoryAPI
export const categoryAPI = {
  getAll: (data) =>
    apiRequest("/inventory/v1/category", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/inventory/v1/category/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/inventory/v1/category/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/inventory/v1/category/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/inventory/v1/category/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/inventory/v1/category/get-all-active", {
      body: data,
    })
};
