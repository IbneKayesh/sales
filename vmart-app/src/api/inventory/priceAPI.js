import { apiRequest } from "@/utils/api.js";

//priceAPI
export const priceAPI = {
  getAll: (data) =>
    apiRequest("/inventory/v1/price", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/inventory/v1/price/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/inventory/v1/price/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/inventory/v1/price/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/inventory/v1/price/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/inventory/v1/price/get-all-active", {
      body: data,
    })
};
