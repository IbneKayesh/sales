import { apiRequest } from "@/utils/api.js";

//invoiceAPI
export const invoiceAPI = {
  getAll: (data) =>
    apiRequest("/M02/v1/invoice", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M02/v1/invoice/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M02/v1/invoice/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M02/v1/invoice/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M02/v1/invoice/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M02/v1/invoice/get-all-active", {
      body: data,
    }),
  getDetailsByMasterId: (data) =>
    apiRequest("/M02/v1/invoice/get-details-by-master", {
      body: data,
    }),
  getCostsByMasterId: (data) =>
    apiRequest("/M02/v1/invoice/get-costs-by-master", {
      body: data,
    }),
  getPaymentsByMasterId: (data) =>
    apiRequest("/M02/v1/invoice/get-payments-by-master", {
      body: data,
    }),
  getExpensesPaymentsHeads: (data) =>
    apiRequest("/M02/v1/invoice/get-expenses-payments-heads", {
      body: data,
    }),
  getAllDueInvoice: (data) =>
    apiRequest("/M02/v1/invoice/get-all-due-invoice", {
      body: data,
    }),
};
