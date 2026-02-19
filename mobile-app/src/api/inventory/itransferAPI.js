import { apiRequest } from "@/utils/api.js";

//itransferAPI
export const itransferAPI = {
  getAll: (data) =>
    apiRequest("/inventory/itransfer", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/inventory/itransfer/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/inventory/itransfer/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/inventory/itransfer/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getDetails: (data) =>
    apiRequest("/inventory/itransfer/transfer-details", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getExpenses: (data) =>
    apiRequest("/inventory/itransfer/transfer-expense", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getPayment: (data) =>
    apiRequest("/inventory/itransfer/transfer-payment", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
