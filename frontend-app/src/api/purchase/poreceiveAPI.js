import { apiRequest } from "@/utils/api.js";

export const poreceiveAPI = {
  getAll: () => apiRequest("/purchase/receive"),

  getDetails: (master_id) =>
    apiRequest(`/purchase/receive/details/${master_id}`),

  getPayments: (master_id) =>
    apiRequest(`/purchase/receive/payments/${master_id}`),

  getPendingReceiveDetails: (contact_id) =>
    apiRequest(`/purchase/receive/pending/${contact_id}`),

  create: (order) =>
    apiRequest("/purchase/receive/create", {
      method: "POST",
      body: JSON.stringify(order),
    }),

  update: (order) =>
    apiRequest("/purchase/receive/update", {
      method: "POST",
      body: JSON.stringify(order),
    }),
};