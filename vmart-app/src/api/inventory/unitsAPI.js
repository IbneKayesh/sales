import { apiRequest } from "@/utils/api.js";

//unitsAPI
export const unitsAPI = {
  getAll: (data) =>
    apiRequest("/inventory/v1/units", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/inventory/v1/units/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/inventory/v1/units/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/inventory/v1/units/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/inventory/v1/units/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/inventory/v1/units/get-all-active", {
      body: data,
    })
};
