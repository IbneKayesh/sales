import { apiRequest } from "@/utils/api.js";

//wkshfAPI
export const wkshfAPI = {
  getAll: (data) =>
    apiRequest("/M07/v1/work-shift", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M07/v1/work-shift/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M07/v1/work-shift/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M07/v1/work-shift/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M07/v1/work-shift/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M07/v1/work-shift/get-all-active", {
      body: data,
    }),
};
