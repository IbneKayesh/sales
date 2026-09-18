import { apiRequest } from "@/utils/api";

export const teachAPI = {
  getAll: (data) =>
    apiRequest("/M101/v1/teach", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M101/v1/teach/get-all-active", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M101/v1/teach/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M101/v1/teach/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M101/v1/teach/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M101/v1/teach/delete", {
      body: data,
    }),
};
