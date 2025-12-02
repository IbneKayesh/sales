import { apiRequest } from "@/utils/api.js";

// Closing Process API
const closingProcess = {
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
  updateProductStock: (id) =>
    apiRequest("/setup/closing-process/update-product-stock", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
};

export const closingProcessAPI = async (id, value) => {
  if (id === "Purchase") {
    await closingProcess.updatePurchaseDue(value);
    await closingProcess.updateBankAccounts(value);
    await closingProcess.updateProductStock(value);
  } else if (id === "Bank Payments") {
    await closingProcess.updatePurchaseDue(value);
    await closingProcess.updateBankAccounts(value);
  } else if (id === "Product Stock") {
    await closingProcess.updateProductStock(value);
  }
};
