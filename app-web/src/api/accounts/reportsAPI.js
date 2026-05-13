import { apiRequest } from "@/utils/api.js";

//reportsAPI
export const reportsAPI = {
  getTrialBalance: (data) =>
    apiRequest("/accounts/v1/reports/get-trial-balance", { body: data }),
  getPnL: (data) => apiRequest("/accounts/v1/reports/get-pnl", { body: data }),
  getLedgerData: (data) =>
    apiRequest("/accounts/v1/reports/get-ledger-data", { body: data }),
};
