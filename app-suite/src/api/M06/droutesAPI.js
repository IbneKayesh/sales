import { apiRequest } from "@/utils/api.js";

//droutesAPI
export const droutesAPI = {
  getAll: (data) =>
    apiRequest("/M06/v1/droutes", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M06/v1/droutes/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M06/v1/droutes/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M06/v1/droutes/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M06/v1/droutes/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M06/v1/droutes/get-all-active", {
      body: data,
    }),
  getByTerritory: (data) =>
    apiRequest("/M06/v1/droutes/get-by-territory", {
      body: data,
    }),
};
