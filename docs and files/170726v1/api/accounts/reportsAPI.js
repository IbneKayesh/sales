import { apiRequest } from "@/utils/api.js";

//reportsAPI
export const reportsAPI = {
  getJournalDetails: (data) =>
    apiRequest("/accounts/v1/reports/get-journal-details", { body: data }),
  getPnL: (data) => apiRequest("/accounts/v1/reports/get-pnl", { body: data }),
  getLedgerData: (data) =>
    apiRequest("/accounts/v1/reports/get-ledger-data", { body: data }),
};
