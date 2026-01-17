import { apiRequest } from "@/utils/api.js";

// Closing Process API
const closingProcess = {
  purchaseBooking: (data) =>
    apiRequest("/setup/closing/purchase-booking", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  accountsLedger: (data) =>
    apiRequest("/setup/closing/accounts-ledger", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  payableDue: (data) =>
    apiRequest("/setup/closing/payable-due", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  purchaseReceipt: (data) =>
    apiRequest("/setup/closing/purchase-receipt", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export const closingProcessAPI = async (id, value) => {
  const fromData = {
    id: value,
  };
  if (id === "purchase-booking") {
    await closingProcess.purchaseBooking(fromData);
  }
  if (id === "accounts-ledger") {
    await closingProcess.accountsLedger(fromData);
  }
  if (id === "payable-due") {
    await closingProcess.payableDue(fromData);
  }
  if (id === "purchase-receipt") {
    await closingProcess.purchaseReceipt(fromData);
  }
};
