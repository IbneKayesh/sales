import { apiRequest } from "@/utils/api.js";

//ordersAPI
export const ordersAPI = {
  getAll: (data) =>
    apiRequest("/M02/v1/orders", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M02/v1/orders/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M02/v1/orders/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M02/v1/orders/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M02/v1/orders/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M02/v1/orders/get-all-active", {
      body: data,
    }),
  getDetailsByMasterId: (data) =>
    apiRequest("/M02/v1/orders/get-details-by-master", {
      body: data,
    }),
  getCostsByMasterId: (data) =>
    apiRequest("/M02/v1/orders/get-costs-by-master", {
      body: data,
    }),
  getPaymentsByMasterId: (data) =>
    apiRequest("/M02/v1/orders/get-payments-by-master", {
      body: data,
    }),
  getBundlesByMasterId: (data) =>
    apiRequest("/M02/v1/orders/get-bundles-by-master", {
      body: data,
    }),
  getAllDueMRR: (data) =>
    apiRequest("/M02/v1/orders/get-all-due-orders", {
      body: data,
    }),
};
