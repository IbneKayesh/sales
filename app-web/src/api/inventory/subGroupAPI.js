import { apiRequest } from "@/utils/api.js";

//subGroupAPI
export const subGroupAPI = {
  getAll: (data) =>
    apiRequest("/inventory/v1/sub-group", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/inventory/v1/sub-group/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/inventory/v1/sub-group/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/inventory/v1/sub-group/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/inventory/v1/sub-group/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/inventory/v1/sub-group/get-all-active", {
      body: data,
    })
};
