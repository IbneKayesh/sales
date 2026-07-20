import { apiRequest } from "@/utils/api.js";

//categoriesAPI
export const categoriesAPI = {
  getAll: (data) =>
    apiRequest("/M04/v1/categories", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M04/v1/categories/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M04/v1/categories/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M04/v1/categories/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M04/v1/categories/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M04/v1/categories/get-all-active", {
      body: data,
    }),
};
