import { apiRequest } from "@/utils/api.js";

export const poreturnAPI = {
  getAll: () => apiRequest("/purchase/return"),

  getDetails: (master_id) =>
    apiRequest(`/purchase/return/details/${master_id}`),

  getPayments: (master_id) =>
    apiRequest(`/purchase/return/payments/${master_id}`),

  getNewReturnMaster: (returnData) =>
    apiRequest(`/purchase/return/newreturn-master`, {
      method: "POST",
      body: JSON.stringify(returnData),
    }),

  getNewReturnDetails: (returnData) =>
    apiRequest(`/purchase/return/newreturn-details`, {
      method: "POST",
      body: JSON.stringify(returnData),
    }),

  create: (order) =>
    apiRequest("/purchase/return/create", {
      method: "POST",
      body: JSON.stringify(order),
    }),

  update: (order) =>
    apiRequest("/purchase/return/update", {
      method: "POST",
      body: JSON.stringify(order),
    }),
};
