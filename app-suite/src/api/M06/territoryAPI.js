import { apiRequest } from "@/utils/api.js";

//territoryAPI
export const territoryAPI = {
  getAll: (data) =>
    apiRequest("/contacts/v1/territories", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/contacts/v1/territories/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/contacts/v1/territories/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/contacts/v1/territories/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/contacts/v1/territories/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/contacts/v1/territories/get-all-active", {
      body: data,
    }),
};
