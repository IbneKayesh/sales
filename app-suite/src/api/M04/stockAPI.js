import { apiRequest } from "@/utils/api.js";

//stockAPI
export const stockAPI = {
  getAll: (data) =>
    apiRequest("/M04/v1/stock", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M04/v1/stock/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M04/v1/stock/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M04/v1/stock/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M04/v1/stock/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M04/v1/stock/get-all-active", {
      body: data,
    }),
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
  getStockLine: (data) =>
    apiRequest("/M04/v1/stock/get-stock-line", {
      body: data,
    }),
};
