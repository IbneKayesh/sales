import { apiRequest } from "@/utils/api.js";

//costingAPI
export const costingAPI = {
  getAll: (data) =>
    apiRequest("/M04/v1/price-costing", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M04/v1/price-costing/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M04/v1/price-costing/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M04/v1/price-costing/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M04/v1/price-costing/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M04/v1/price-costing/get-all-active", {
      body: data,
    }),
  getPrice: (data) =>
    apiRequest("/M04/v1/price-costing/get-price", {
      body: data,
    }),
};
