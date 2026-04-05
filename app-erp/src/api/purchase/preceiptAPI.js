import { apiRequest } from "@/utils/api.js";

//preceiptAPI
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
  getExpenses: (data) =>
    apiRequest("/purchase/preceipt/receipt-expense", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getPayment: (data) =>
    apiRequest("/purchase/preceipt/receipt-payment", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAvailableReceiptItems: (data) =>
    apiRequest("/purchase/preceipt/available-receipt-items", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
