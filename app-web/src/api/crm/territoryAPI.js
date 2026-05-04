import { apiRequest } from "@/utils/api.js";

//territoryAPI
export const territoryAPI = {
  getAll: (data) =>
    apiRequest("/crm/v1/territory", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/crm/v1/territory/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/crm/v1/territory/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/crm/v1/territory/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/crm/v1/territory/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/crm/v1/territory/get-all-active", {
      body: data,
    }),
};
