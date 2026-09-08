import { apiRequest } from "@/utils/api.js";

//dataProcessAPI
export const dataProcessAPI = {
  avgProductCost: (data) =>
    apiRequest("/M01/v1/data-process/avg-product-cost", {
      body: data,
    }),
  subLedgerCurrentBalance: (data) =>
    apiRequest("/M01/v1/data-process/sub-ledger-current-balance", {
      body: data,
    }),
};
