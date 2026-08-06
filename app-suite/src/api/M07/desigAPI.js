import { apiRequest } from "@/utils/api.js";

//desigAPI
export const desigAPI = {
  getAll: (data) =>
    apiRequest("/M07/v1/designations", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M07/v1/designations/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M07/v1/designations/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M07/v1/designations/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M07/v1/designations/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M07/v1/designations/get-all-active", {
      body: data,
    }),
};
