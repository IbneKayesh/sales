import { apiRequest } from "@/utils/api.js";

//mrrAPI
export const mrrAPI = {
  getAll: (data) =>
    apiRequest("/M03/v1/mrr", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M03/v1/mrr/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M03/v1/mrr/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M03/v1/mrr/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M03/v1/mrr/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M03/v1/mrr/get-all-active", {
      body: data,
    }),
  getDetailsByMasterId: (data) =>
    apiRequest("/M03/v1/mrr/get-details-by-master", {
      body: data,
    }),
  getExpensesPaymentsHeads: (data) =>
    apiRequest("/M03/v1/mrr/get-expenses-payments-heads", {
      body: data,
    }),
};
