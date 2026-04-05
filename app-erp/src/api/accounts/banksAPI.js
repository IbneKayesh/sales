import { apiRequest } from "@/utils/api.js";

// Accounts API
export const banksAPI = {
  getAll: () => apiRequest("/accounts/banks"),
  getAllAccounts: () => apiRequest("/accounts/banks/accounts-all"),
  getById: (id) => apiRequest(`/accounts/banks/${id}`),
  getAccounts: (bank_id) => apiRequest(`/accounts/banks/accounts/${bank_id}`),
  create: (account) =>
    apiRequest("/accounts/banks", {
      method: "POST",
      body: JSON.stringify(account),
    }),
  update: (account) =>
    apiRequest("/accounts/banks/update", {
      method: "POST",
      body: JSON.stringify(account),
    }),
  delete: (account) =>
    apiRequest("/accounts/banks/delete", {
      method: "POST",
      body: JSON.stringify(account),
    }),
  createAccount: (account) =>
    apiRequest("/accounts/banks/accounts", {
      method: "POST",
      body: JSON.stringify(account),
    }),
  updateAccount: (account) =>
    apiRequest("/accounts/banks/accounts/update", {
      method: "POST",
      body: JSON.stringify(account),
    }),
  deleteAccount: (account) =>
    apiRequest("/accounts/banks/accounts/delete", {
      method: "POST",
      body: JSON.stringify(account),
    }),
};
