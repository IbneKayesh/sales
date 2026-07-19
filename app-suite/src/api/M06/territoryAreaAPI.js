import { apiRequest } from "@/utils/api.js";

//territoryAreaAPI
export const territoryAreaAPI = {
  getAll: (data) =>
    apiRequest("/contacts/v1/territory-areas", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/contacts/v1/territory-areas/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/contacts/v1/territory-areas/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/contacts/v1/territory-areas/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/contacts/v1/territory-areas/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/contacts/v1/territory-areas/get-all-active", {
      body: data,
    }),
};
