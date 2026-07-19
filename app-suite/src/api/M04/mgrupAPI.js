import { apiRequest } from "@/utils/api.js";

//mgrupAPI
export const mgrupAPI = {
  getAll: (data) =>
    apiRequest("/inventory/v1/main-groups", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/inventory/v1/main-groups/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/inventory/v1/main-groups/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/inventory/v1/main-groups/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/inventory/v1/main-groups/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/inventory/v1/main-groups/get-all-active", {
      body: data,
    }),
};
