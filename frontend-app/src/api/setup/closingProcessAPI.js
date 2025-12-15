import { apiRequest } from "@/utils/api.js";

// Closing Process API
const closingProcess = {
  purchaseBooking: (id) =>
    apiRequest("/setup/closing-process/purchase-booking", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
  purchaseReceive: (id) =>
    apiRequest("/setup/closing-process/purchase-receive", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
  purchaseOrder: (id) =>
    apiRequest("/setup/closing-process/purchase-order", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
  payableDue: (id) =>
    apiRequest("/setup/closing-process/payable-due", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),

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
    // await closingProcess.updateBalances(value);
    await closingProcess.updateProductStock(value);
  } else if (id === "Payments") {
    await closingProcess.updateInvoiceDue(value);
    await closingProcess.updateBalances(value);
  } else if (id === "Purchase Booking") {
    await closingProcess.purchaseBooking(value);
  } else if (id === "Purchase Receive") {
    await closingProcess.purchaseReceive(value);
  } else if (id === "Purchase Order") {
    await closingProcess.purchaseOrder(value);
  } else if (id === "Payable Due") {
    await closingProcess.payableDue(value);
  }
};
