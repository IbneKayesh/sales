import { apiRequest } from "@/utils/api.js";

//groupAPI
export const groupAPI = {
  getAll: (data) =>
    apiRequest("/inventory/v1/group", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/inventory/v1/group/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/inventory/v1/group/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/inventory/v1/group/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/inventory/v1/group/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/inventory/v1/group/get-all-active", {
      body: data,
    })
};
