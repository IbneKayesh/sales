import { apiRequest } from "@/utils/api.js";

//pendingProcessAPI
export const pendingProcessAPI = {
  avgProductCost: (data) =>
    apiRequest("/M01/v1/pending-process/avg-product-cost", {
      body: data,
    }),
  subLedgerCurrentBalance: (data) =>
    apiRequest("/M01/v1/pending-process/sub-ledger-current-balance", {
      body: data,
    }),
};
