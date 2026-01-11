import { apiRequest } from "@/utils/api.js";

// Accounts Heads API
export const accountsHeadsAPI = {
  getAll: (data) =>
    apiRequest("/accounts/accounts-heads", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/accounts/accounts-heads/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
