import { apiRequest } from "@/utils/api.js";

//bundleAPI
export const bundleAPI = {
  getAll: (data) =>
    apiRequest("/M04/v1/bundle", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M04/v1/bundle/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M04/v1/bundle/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M04/v1/bundle/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M04/v1/bundle/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M04/v1/bundle/get-all-active", {
      body: data,
    }),
};
