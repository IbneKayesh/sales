import { apiRequest } from "@/utils/api.js";

export const poorderAPI = {
  getAll: () => apiRequest("/purchase/order"),

  getDetails: (master_id) =>
    apiRequest(`/purchase/order/details/${master_id}`),

  getPayments: (master_id) =>
    apiRequest(`/purchase/order/payments/${master_id}`),

  create: (order) =>
    apiRequest("/purchase/order/create", {
      method: "POST",
      body: JSON.stringify(order),
    }),

  update: (order) =>
    apiRequest("/purchase/order/update", {
      method: "POST",
      body: JSON.stringify(order),
    }),
};