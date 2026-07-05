import { apiRequest } from "@/utils/api.js";

//partiesAPI
export const partiesAPI = {
  getAll: (data) =>
    apiRequest("/accounts/v1/party", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/accounts/v1/party/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/accounts/v1/party/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/accounts/v1/party/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/accounts/v1/party/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/accounts/v1/party/get-all-active", {
      body: data,
    }),
  getByCoa: (data) =>
    apiRequest("/accounts/v1/party/get-by-coa", {
      body: data,
    }),
  getByContacts: (data) =>
    apiRequest("/accounts/v1/party/get-by-contacts", {
      body: data,
    }),
};
