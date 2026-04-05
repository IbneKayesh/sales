import { apiRequest } from "@/utils/api.js";

//pinvoiceAPI
export const pinvoiceAPI = {
  getAll: (data) =>
    apiRequest("/purchase/pinvoice", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/purchase/pinvoice/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/purchase/pinvoice/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/purchase/pinvoice/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getDetails: (data) =>
    apiRequest("/purchase/pinvoice/invoice-details", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getExpenses: (data) =>
    apiRequest("/purchase/pinvoice/invoice-expense", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getPayment: (data) =>
    apiRequest("/purchase/pinvoice/invoice-payment", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
