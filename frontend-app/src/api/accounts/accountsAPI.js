import { apiRequest } from "@/utils/api.js";

//Accounts API
export const accountsAPI = {
  getAll: (data) =>
    apiRequest("/accounts/accounts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/accounts/accounts/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/accounts/accounts/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/accounts/accounts/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
