import { apiRequest } from "@/utils/api.js";

// Accounts Heads API
export const accountsHeadsAPI = {
  getAll: (data) =>
    apiRequest("/accounts/accounts-heads", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/accounts/accounts-heads/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/accounts/accounts-heads/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/accounts/accounts-heads/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAllActive: (data) =>
    apiRequest("/accounts/accounts-heads/get-all-active", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAllAdvice: (data) =>
    apiRequest("/accounts/accounts-heads/get-all-advice", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
