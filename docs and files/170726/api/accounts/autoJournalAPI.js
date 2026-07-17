import { apiRequest } from "@/utils/api.js";

//autoJournalAPI
export const autoJournalAPI = {
  getAll: (data) =>
    apiRequest("/accounts/v1/auto-journal", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/accounts/v1/auto-journal/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/accounts/v1/auto-journal/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/accounts/v1/auto-journal/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/accounts/v1/auto-journal/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/accounts/v1/auto-journal/get-all-active", {
      body: data,
    }),
  getByInterface: (data) =>
    apiRequest("/accounts/v1/auto-journal/get-by-interface", {
      body: data,
    }),
};
