import { apiRequest } from "@/utils/api.js";

//brandsAPI
export const brandsAPI = {
  getAll: (data) =>
    apiRequest("/inventory/v1/brands", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/inventory/v1/brands/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/inventory/v1/brands/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/inventory/v1/brands/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/inventory/v1/brands/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/inventory/v1/brands/get-all-active", {
      body: data,
    })
};
