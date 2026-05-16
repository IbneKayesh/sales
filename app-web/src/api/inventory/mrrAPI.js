import { apiRequest } from "@/utils/api.js";

//mrrAPI
export const mrrAPI = {
  getAll: (data) =>
    apiRequest("/inventory/v1/mrr", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/inventory/v1/mrr/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/inventory/v1/mrr/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/inventory/v1/mrr/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/inventory/v1/mrr/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/inventory/v1/mrr/get-all-active", {
      body: data,
    }),
  getMrrItems: (data) =>
    apiRequest("/inventory/v1/mrr/get-mrr-items", {
      body: data,
    }),
};
