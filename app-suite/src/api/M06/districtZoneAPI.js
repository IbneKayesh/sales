import { apiRequest } from "@/utils/api.js";

//districtZoneAPI
export const districtZoneAPI = {
  getAll: (data) =>
    apiRequest("/M06/v1/dzones", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M06/v1/dzones/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M06/v1/dzones/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M06/v1/dzones/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M06/v1/dzones/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M06/v1/dzones/get-all-active", {
      body: data,
    }),
};
