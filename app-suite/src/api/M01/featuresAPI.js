import { apiRequest } from "@/utils/api.js";

//featuresAPI
export const featuresAPI = {
  getAll: (data) =>
    apiRequest("/M01/v1/features", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M01/v1/features/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M01/v1/features/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M01/v1/features/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M01/v1/features/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M01/v1/features/get-all-active", {
      body: data,
    }),
};
