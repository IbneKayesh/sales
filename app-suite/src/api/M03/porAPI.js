import { apiRequest } from "@/utils/api.js";

//porAPI
export const porAPI = {
  getAll: (data) =>
    apiRequest("/M03/v1/por", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M03/v1/por/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M03/v1/por/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M03/v1/por/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M03/v1/por/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M03/v1/por/get-all-active", {
      body: data,
    }),
  getDetailsByMasterId: (data) =>
    apiRequest("/M03/v1/por/get-details-by-master", {
      body: data,
    }),
  getCostsByMasterId: (data) =>
    apiRequest("/M03/v1/por/get-costs-by-master", {
      body: data,
    }),
  getPaymentsByMasterId: (data) =>
    apiRequest("/M03/v1/por/get-payments-by-master", {
      body: data,
    }),
  getBundlesByMasterId: (data) =>
    apiRequest("/M03/v1/por/get-bundles-by-master", {
      body: data,
    }),
  getAllDuepor: (data) =>
    apiRequest("/M03/v1/por/get-all-due-mrr", {
      body: data,
    }),
};
