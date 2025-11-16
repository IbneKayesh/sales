import { apiRequest } from "@/utils/api.js";

// Closing Process API
export const closingProcessAPI = {
  updateBankTransaction: (id) =>
    apiRequest("/closing-process/update-bank-transaction", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
  updateItemProfit: (id) =>
    apiRequest("/closing-process/update-item-profit", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
};
