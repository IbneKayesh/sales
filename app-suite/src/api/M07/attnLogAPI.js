import { apiRequest } from "@/utils/api.js";

//attnLogAPI
export const attnLogAPI = {
  getAll: (data) =>
    apiRequest("/M07/v1/attend-log", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M07/v1/attend-log/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M07/v1/attend-log/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M07/v1/attend-log/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M07/v1/attend-log/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M07/v1/attend-log/get-all-active", {
      body: data,
    }),
};
