import { apiRequest } from "@/utils/api.js";

//rawMaterialAPI
export const rawMaterialAPI = {
  getAll: (data) =>
    apiRequest("/M05/v1/raw-materials", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M05/v1/raw-materials/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M05/v1/raw-materials/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M05/v1/raw-materials/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M05/v1/raw-materials/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M05/v1/raw-materials/get-all-active", {
      body: data,
    }),
};
