import { apiRequest } from "@/utils/api.js";

//scatgAPI
export const scatgAPI = {
  getAll: (data) =>
    apiRequest("/inventory/v1/sub-categories", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/inventory/v1/sub-categories/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/inventory/v1/sub-categories/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/inventory/v1/sub-categories/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/inventory/v1/sub-categories/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/inventory/v1/sub-categories/get-all-active", {
      body: data,
    }),
};
