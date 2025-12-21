import { apiRequest } from "@/utils/api.js";

export const pobookingAPI = {
  getAll: () => apiRequest("/purchase/booking"),

  getDetails: (master_id) =>
    apiRequest(`/purchase/booking/details/${master_id}`),

  getPayments: (master_id) =>
    apiRequest(`/purchase/booking/payments/${master_id}`),

  cancelBooking: (master_id) =>
    apiRequest(`/purchase/booking/cancel-booking/${master_id}`, {
      method: "POST",
    }),

  create: (order) =>
    apiRequest("/purchase/booking/create", {
      method: "POST",
      body: JSON.stringify(order),
    }),

  update: (order) =>
    apiRequest("/purchase/booking/update", {
      method: "POST",
      body: JSON.stringify(order),
    }),
};