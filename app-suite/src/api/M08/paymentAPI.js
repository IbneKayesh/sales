import { apiRequest } from "@/utils/api.js";

//paymentAPI
export const paymentAPI = {
  getAll: (data) =>
    apiRequest("/M08/v1/coa", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M08/v1/coa/upsert", {
      body: data,
    }),
  mrrPayment: (data) =>
    apiRequest("/M08/v1/payments/mrr-payment", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M08/v1/coa/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M08/v1/coa/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M08/v1/coa/get-all-active", {
      body: data,
    }),
  getCoaChildOnly: (data) =>
    apiRequest("/M08/v1/coa/get-coa-child-only", {
      body: data,
    }),
  getWithPartyCount: (data) =>
    apiRequest("/M08/v1/coa/get-with-party-count", {
      body: data,
    }),
};
