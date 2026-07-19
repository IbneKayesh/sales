import { apiRequest } from "@/utils/api.js";

//sgrupAPI
export const sgrupAPI = {
  getAll: (data) =>
    apiRequest("/inventory/v1/sub-groups", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/inventory/v1/sub-groups/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/inventory/v1/sub-groups/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/inventory/v1/sub-groups/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/inventory/v1/sub-groups/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/inventory/v1/sub-groups/get-all-active", {
      body: data,
    }),
};
