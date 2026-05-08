import { apiRequest } from "@/utils/api.js";

//accountHeadsAPI
export const accountHeadsAPI = {
  getAll: (data) =>
    apiRequest("/accounts/v1/account-heads", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/accounts/v1/account-heads/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/accounts/v1/account-heads/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/accounts/v1/account-heads/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/accounts/v1/account-heads/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/accounts/v1/account-heads/get-all-active", {
      body: data,
    }),
};
