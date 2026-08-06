import { apiRequest } from "@/utils/api.js";

//contactAPI
export const contactAPI = {
  getAll: (data) =>
    apiRequest("/M06/v1/contacts", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M06/v1/contacts/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M06/v1/contacts/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M06/v1/contacts/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M06/v1/contacts/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M06/v1/contacts/get-all-active", {
      body: data,
    }),
  getSuppliers: (data) =>
    apiRequest("/M06/v1/contacts/get-suppliers", {
      body: data,
    }),
  getCustomers: (data) =>
    apiRequest("/M06/v1/contacts/get-customers", {
      body: data,
    }),
  upsertAddress: (data) =>
    apiRequest("/M06/v1/contacts/upsert-address", {
      body: data,
    }),
  getAddress: (data) =>
    apiRequest("/M06/v1/contacts/get-address", {
      body: data,
    }),
  deleteAddress: (data) =>
    apiRequest("/M06/v1/contacts/delete-address", {
      body: data,
    }),
};
