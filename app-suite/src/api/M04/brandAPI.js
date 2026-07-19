import { apiRequest } from "@/utils/api.js";

//brandAPI
export const brandAPI = {
  getAll: (data) =>
    apiRequest("/M04/v1/brands", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M04/v1/brands/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M04/v1/brands/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M04/v1/brands/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M04/v1/brands/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M04/v1/brands/get-all-active", {
      body: data,
    }),
};
