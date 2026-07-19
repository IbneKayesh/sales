import { apiRequest } from "@/utils/api.js";

//mcatgAPI
export const mcatgAPI = {
  getAll: (data) =>
    apiRequest("/inventory/v1/main-categories", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/inventory/v1/main-categories/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/inventory/v1/main-categories/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/inventory/v1/main-categories/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/inventory/v1/main-categories/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/inventory/v1/main-categories/get-all-active", {
      body: data,
    }),
};
