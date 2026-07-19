import { apiRequest } from "@/utils/api.js";

//contactAPI
export const contactAPI = {
  getAll: (data) =>
    apiRequest("/contacts/v1/contacts", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/contacts/v1/contacts/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/contacts/v1/contacts/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/contacts/v1/contacts/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/contacts/v1/contacts/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/contacts/v1/contacts/get-all-active", {
      body: data,
    }),
};
