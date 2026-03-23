import { apiRequest } from "@/utils/api.js";

//expensesAPI
export const expensesAPI = {
  getAll: (data) =>
    apiRequest("/accounts/expenses", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/accounts/expenses/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/accounts/expenses/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/accounts/expenses/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
