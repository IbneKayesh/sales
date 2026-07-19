import { apiRequest } from "@/utils/api.js";

//coaAPI
export const coaAPI = {
  getAll: (data) =>
    apiRequest("/accounts/v1/coa", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/accounts/v1/coa/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/accounts/v1/coa/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/accounts/v1/coa/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/accounts/v1/coa/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/accounts/v1/coa/get-all-active", {
      body: data,
    }),
  getCoaPosting: (data) =>
    apiRequest("/accounts/v1/coa/get-coa-posting", {
      body: data,
    }),
  getWithPartyCount: (data) =>
    apiRequest("/accounts/v1/coa/get-with-party-count", {
      body: data,
    }),
};
