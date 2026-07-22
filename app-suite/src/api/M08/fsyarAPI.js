import { apiRequest } from "@/utils/api.js";

//fsyarAPI
export const fsyarAPI = {
  getAll: (data) =>
    apiRequest("/accounts/v1/fiscal-years", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/accounts/v1/fiscal-years/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/accounts/v1/fiscal-years/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/accounts/v1/fiscal-years/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/accounts/v1/fiscal-years/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/accounts/v1/fiscal-years/get-all-active", {
      body: data,
    }),
};
