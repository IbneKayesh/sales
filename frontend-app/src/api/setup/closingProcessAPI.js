import { apiRequest } from "@/utils/api.js";

// Closing Process API
export const closingProcessAPI = {
  updatePurchaseDue: (id) =>
    apiRequest("/setup/closing-process/update-purchase-due", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
  updateBankAccounts: (id) =>
    apiRequest("/setup/closing-process/update-bank-accounts", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
};
