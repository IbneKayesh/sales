import { apiRequest } from "@/utils/api.js";

//attrbAPI
export const attrbAPI = {
  getAll: (data) =>
    apiRequest("/M04/v1/attributes", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M04/v1/attributes/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M04/v1/attributes/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M04/v1/attributes/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M04/v1/attributes/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M04/v1/attributes/get-all-active", {
      body: data,
    }),
};
