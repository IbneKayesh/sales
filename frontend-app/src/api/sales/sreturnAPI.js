import { apiRequest } from "@/utils/api.js";

//sreturnAPI
export const sreturnAPI = {
  getAll: (data) =>
    apiRequest("/sales/sreturn", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/sales/sreturn/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getDetails: (data) =>
    apiRequest("/sales/sreturn/return-details", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getExpenses: (data) =>
    apiRequest("/sales/sreturn/return-expense", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getPayment: (data) =>
    apiRequest("/sales/sreturn/return-payment", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
