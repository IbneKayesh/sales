import { apiRequest } from "@/utils/api.js";

//journalAPI
export const journalAPI = {
  getAll: (data) =>
    apiRequest("/accounts/v1/journal", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/accounts/v1/journal/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/accounts/v1/journal/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/accounts/v1/journal/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/accounts/v1/journal/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/accounts/v1/journal/get-all-active", {
      body: data,
    }),
  getDetail: (data) =>
    apiRequest("/accounts/v1/journal/get-detail", {
      body: data,
    }),
};
