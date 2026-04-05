import { apiRequest } from "@/utils/api.js";

//sreceiptAPI
export const sreceiptAPI = {
  getAll: (data) =>
    apiRequest("/sales/sreceipt", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/sales/sreceipt/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/sales/sreceipt/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/sales/sreceipt/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getDetails: (data) =>
    apiRequest("/sales/sreceipt/receipt-details", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getExpenses: (data) =>
    apiRequest("/sales/sreceipt/receipt-expense", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getPayment: (data) =>
    apiRequest("/sales/sreceipt/receipt-payment", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAvailableReceiptItems: (data) =>
    apiRequest("/sales/sreceipt/available-receipt-items", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
