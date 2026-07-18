import { apiRequest } from "@/utils/api.js";

//productionAPI
export const productionAPI = {
  getAll: (data) =>
    apiRequest("/manufacturing/v1/productions", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/manufacturing/v1/productions/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/manufacturing/v1/productions/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/manufacturing/v1/productions/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/manufacturing/v1/productions/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/manufacturing/v1/productions/get-all-active", {
      body: data,
    }),
};
