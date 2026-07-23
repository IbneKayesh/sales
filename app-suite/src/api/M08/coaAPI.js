import { apiRequest } from "@/utils/api.js";

//coaAPI
export const coaAPI = {
  getAll: (data) =>
    apiRequest("/M08/v1/coa", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M08/v1/coa/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M08/v1/coa/create", {
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
  getCoaPosting: (data) =>
    apiRequest("/M08/v1/coa/get-coa-posting", {
      body: data,
    }),
  getWithPartyCount: (data) =>
    apiRequest("/M08/v1/coa/get-with-party-count", {
      body: data,
    }),
};
