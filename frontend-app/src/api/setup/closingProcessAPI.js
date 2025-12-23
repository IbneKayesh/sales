import { apiRequest } from "@/utils/api.js";

// Closing Process API
const closingProcess = {
  purchaseBooking: (id) =>
    apiRequest("/setup/closing-process/purchase-booking", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
  purchaseBookingCancel: (id) =>
    apiRequest("/setup/closing-process/purchase-booking-cancel", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
  purchaseInvoice: (id) =>
    apiRequest("/setup/closing-process/purchase-invoice", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
  purchaseOrder: (id) =>
    apiRequest("/setup/closing-process/purchase-order", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
  purchaseReturn: (id) =>
    apiRequest("/setup/closing-process/purchase-return", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
  payableDue: (id) =>
    apiRequest("/setup/closing-process/payable-due", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
  accountsLedger: (id) =>
    apiRequest("/setup/closing-process/accounts-ledger", {
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
  } else if (id === "Purchase Booking Cancel") {
    await closingProcess.purchaseBookingCancel(value);
  } else if (id === "Purchase Invoice") {
    await closingProcess.purchaseInvoice(value);
  } else if (id === "Purchase Order") {
    await closingProcess.purchaseOrder(value);
  } else if (id === "Purchase Return") {
    await closingProcess.purchaseReturn(value);
  } else if (id === "Payable Due") {
    await closingProcess.payableDue(value);
  } else if (id === "Account Ledger") {
    await closingProcess.accountsLedger(value);
  }
};
