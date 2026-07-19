import { apiRequest } from "@/utils/api.js";

//attrbAPI
export const attrbAPI = {
  getAll: (data) =>
    apiRequest("/inventory/v1/attributes", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/inventory/v1/attributes/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/inventory/v1/attributes/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/inventory/v1/attributes/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/inventory/v1/attributes/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/inventory/v1/attributes/get-all-active", {
      body: data,
    }),
};
