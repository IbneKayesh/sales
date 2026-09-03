import { apiRequest } from "@/utils/api.js";

//mrrAPI
export const mrrAPI = {
  getAll: (data) =>
    apiRequest("/M03/v1/mrr", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M03/v1/mrr/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M03/v1/mrr/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M03/v1/mrr/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M03/v1/mrr/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M03/v1/mrr/get-all-active", {
      body: data,
    }),
  getDetailsByMasterId: (data) =>
    apiRequest("/M03/v1/mrr/get-details-by-master", {
      body: data,
    }),
  getCostsByMasterId: (data) =>
    apiRequest("/M03/v1/mrr/get-costs-by-master", {
      body: data,
    }),
  getPaymentsByMasterId: (data) =>
    apiRequest("/M03/v1/mrr/get-payments-by-master", {
      body: data,
    }),
  getBundlesByMasterId: (data) =>
    apiRequest("/M03/v1/mrr/get-bundles-by-master", {
      body: data,
    }),
  getAllDueMRR: (data) =>
    apiRequest("/M03/v1/mrr/get-all-due-mrr", {
      body: data,
    }),
};
