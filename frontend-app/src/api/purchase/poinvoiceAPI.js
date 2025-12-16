import { apiRequest } from "@/utils/api.js";

export const poinvoiceAPI = {
  getAll: () => apiRequest("/purchase/invoice"),

  getDetails: (master_id) =>
    apiRequest(`/purchase/invoice/details/${master_id}`),

  getPayments: (master_id) =>
    apiRequest(`/purchase/invoice/payments/${master_id}`),

  getPendingInvoiceDetails: (contact_id) =>
    apiRequest(`/purchase/invoice/pending/${contact_id}`),

  create: (order) =>
    apiRequest("/purchase/invoice/create", {
      method: "POST",
      body: JSON.stringify(order),
    }),

  update: (order) =>
    apiRequest("/purchase/invoice/update", {
      method: "POST",
      body: JSON.stringify(order),
    }),
};