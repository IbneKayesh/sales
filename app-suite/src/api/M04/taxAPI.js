import { apiRequest } from "@/utils/api.js";

//taxAPI
export const taxAPI = {
  getAll: (data) =>
    apiRequest("/M04/v1/tax", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M04/v1/tax/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M04/v1/tax/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M04/v1/tax/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M04/v1/tax/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M04/v1/tax/get-all-active", {
      body: data,
    }),
};
