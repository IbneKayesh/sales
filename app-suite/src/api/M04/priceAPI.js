import { apiRequest } from "@/utils/api.js";

//priceAPI
export const priceAPI = {
  getAll: (data) =>
    apiRequest("/M04/v1/prices", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M04/v1/prices/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M04/v1/prices/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M04/v1/prices/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M04/v1/prices/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M04/v1/prices/get-all-active", {
      body: data,
    }),
};
