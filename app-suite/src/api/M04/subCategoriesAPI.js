import { apiRequest } from "@/utils/api.js";

//subCategoriesAPI
export const subCategoriesAPI = {
  getAll: (data) =>
    apiRequest("/M04/v1/sub-categories", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M04/v1/sub-categories/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M04/v1/sub-categories/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M04/v1/sub-categories/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M04/v1/sub-categories/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M04/v1/sub-categories/get-all-active", {
      body: data,
    }),
};
