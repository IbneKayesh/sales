import { apiRequest } from "@/utils/api.js";

//unitsAPI
export const unitsAPI = {
  getAll: (data) =>
    apiRequest("/M04/v1/units", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M04/v1/units/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M04/v1/units/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M04/v1/units/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M04/v1/units/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M04/v1/units/get-all-active", {
      body: data,
    }),
};
