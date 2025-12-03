import { apiRequest } from "@/utils/api.js";

// Closing Process API
const closingProcess = {
  updateInvoiceDue: (id) =>
    apiRequest("/setup/closing-process/update-invoice-due", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
  updateBalances: (id) =>
    apiRequest("/setup/closing-process/update-balances", {
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
  if (["Purchase", "Sales"].includes(id)) {
    await closingProcess.updateInvoiceDue(value);
    await closingProcess.updateBalances(value);
    await closingProcess.updateProductStock(value);
  } else if (id === "Bank Payments") {
    await closingProcess.updateInvoiceDue(value);
    await closingProcess.updateBalances(value);
  }
};
