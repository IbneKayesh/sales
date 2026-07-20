import { apiRequest } from "@/utils/api.js";

//bofohAPI
export const bofohAPI = {
  getAll: (data) =>
    apiRequest("/M05/v1/factory-overhead", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M05/v1/factory-overhead/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M05/v1/factory-overhead/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M05/v1/factory-overhead/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M05/v1/factory-overhead/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M05/v1/factory-overhead/get-all-active", {
      body: data,
    }),
};
