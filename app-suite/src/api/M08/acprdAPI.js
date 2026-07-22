import { apiRequest } from "@/utils/api.js";

//acprdAPI
export const acprdAPI = {
  getAll: (data) =>
    apiRequest("/accounts/v1/accounting-periods", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/accounts/v1/accounting-periods/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/accounts/v1/accounting-periods/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/accounts/v1/accounting-periods/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/accounts/v1/accounting-periods/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/accounts/v1/accounting-periods/get-all-active", {
      body: data,
    }),
};
