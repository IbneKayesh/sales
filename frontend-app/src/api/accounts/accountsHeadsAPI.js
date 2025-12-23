import { apiRequest } from "@/utils/api.js";

// Accounts Heads API
export const accountsHeadsAPI = {
  getAll: () => apiRequest("/accounts/accounts-heads"),
};
