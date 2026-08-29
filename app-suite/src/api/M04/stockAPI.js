import { apiRequest } from "@/utils/api.js";

//stockAPI
export const stockAPI = {
  getAvailable: (data) =>
    apiRequest("/M04/v1/stock/get-available", {
      body: data,
    }),
  getPriceLedger: (data) =>
    apiRequest("/M04/v1/stock/get-price-ledger", {
      body: data,
    }),
  getPriceStockForProcess: (data) =>
    apiRequest("/M04/v1/stock/get-item-price-stock-fr-process", {
      body: data,
    }),
};
