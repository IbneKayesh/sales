import { apiRequest } from "@/utils/api.js";

//partyAPI
export const partyAPI = {
  getAll: (data) =>
    apiRequest("/accounts/v1/parties", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/accounts/v1/parties/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/accounts/v1/parties/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/accounts/v1/parties/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/accounts/v1/parties/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/accounts/v1/parties/get-all-active", {
      body: data,
    }),
};
