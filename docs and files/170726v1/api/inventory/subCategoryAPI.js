import { apiRequest } from "@/utils/api.js";

//subCategoryAPI
export const subCategoryAPI = {
  getAll: (data) =>
    apiRequest("/inventory/v1/sub-category", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/inventory/v1/sub-category/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/inventory/v1/sub-category/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/inventory/v1/sub-category/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/inventory/v1/sub-category/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/inventory/v1/sub-category/get-all-active", {
      body: data,
    })
};
