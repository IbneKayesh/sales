import { apiRequest } from "@/utils/api.js";

//Users API
export const preceiptAPI = {
  getAll: (data) =>
    apiRequest("/purchase/preceipt", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/purchase/preceipt/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/purchase/preceipt/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/purchase/preceipt/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getDetails: (data) =>
    apiRequest("/purchase/preceipt/receipt-details", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getPayment: (data) =>
    apiRequest("/purchase/preceipt/receipt-payment", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAvailableReceipt: (data) =>
    apiRequest("/purchase/preceipt/available-receipt", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
