import { apiRequest } from "@/utils/api.js";

//Accounts Ledger API
export const accountsLedgerAPI = {
  getAll: (data) =>
    apiRequest("/accounts/accounts-ledgers", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/accounts/accounts-ledgers/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/accounts/accounts-ledgers/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/accounts/accounts-ledgers/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  setDefault: (data) =>
    apiRequest("/accounts/accounts-ledgers/set-default", {
      method: "POST",
      body: JSON.stringify(data),
    }),    
  createTransfer: (data) =>
    apiRequest("/accounts/accounts-ledgers/create-transfer", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
