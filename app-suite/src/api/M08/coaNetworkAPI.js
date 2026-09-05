import { apiRequest } from "@/utils/api.js";

//coaNetworkAPI
export const coaNetworkAPI = {
  getAll: (data) =>
    apiRequest("/M08/v1/coa-network", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M08/v1/coa-network/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M08/v1/coa-network/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M08/v1/coa-network/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M08/v1/coa-network/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M08/v1/coa-network/get-all-active", {
      body: data,
    }),
  getByTrnPageId: (data) =>
    apiRequest("/M08/v1/coa-network/get-by-trn-page-id", {
      body: data,
    }),
  getMrrDirectExpPaym: (data) =>
    apiRequest("/M08/v1/coa-network/get-mrr-direct-exp-paym", {
      body: data,
    }),
  getLocalPayment: (data) =>
    apiRequest("/M08/v1/coa-network/get-local-paym", {
      body: data,
    }),
  getSalesInvoiceExpPaym: (data) =>
    apiRequest("/M08/v1/coa-network/get-sales-invoice-exp-paym", {
      body: data,
    }),
};
