import { apiRequest } from "@/utils/api.js";

//itemsAPI
export const itemsAPI = {
  getAll: (data) =>
    apiRequest("/M04/v1/items", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M04/v1/items/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M04/v1/items/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M04/v1/items/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M04/v1/items/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M04/v1/items/get-all-active", {
      body: data,
    }),
};
