import { apiRequest } from "@/utils/api.js";

//sinvoiceAPI
export const sinvoiceAPI = {
  getAll: (data) =>
    apiRequest("/sales/sinvoice", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/sales/sinvoice/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/sales/sinvoice/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/sales/sinvoice/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getDetails: (data) =>
    apiRequest("/sales/sinvoice/invoice-details", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getExpenses: (data) =>
    apiRequest("/sales/sinvoice/invoice-expense", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getPayment: (data) =>
    apiRequest("/sales/sinvoice/invoice-payment", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
