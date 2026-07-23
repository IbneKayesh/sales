import { apiRequest } from "@/utils/api.js";

//hldayAPI
export const hldayAPI = {
  getAll: (data) =>
    apiRequest("/M07/v1/holiday", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M07/v1/holiday/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M07/v1/holiday/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M07/v1/holiday/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M07/v1/holiday/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M07/v1/holiday/get-all-active", {
      body: data,
    }),
};
