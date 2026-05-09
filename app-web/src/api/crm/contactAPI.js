import { apiRequest } from "@/utils/api.js";

//Contacts API
export const contactAPI = {
  getAll: (data) =>
    apiRequest("/crm/v1/contacts", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/crm/v1/contacts/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/crm/v1/contacts/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/crm/v1/contacts/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/crm/v1/contacts/delete", {
      body: data,
    }),
  getAddress: (data) =>
    apiRequest("/crm/v1/contacts/get-address", {
      body: data,
    }),
  getAvailContactAccounts: (data) =>
    apiRequest("/crm/v1/contacts/get-avail-contact-accounts", {
      body: data,
    }),
  getByType: (data) =>
    apiRequest("/crm/contacts/get-by-type", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getContactLedger: (data) =>
    apiRequest(`/crm/contacts/ledger`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAllSuppliers: (data) =>
    apiRequest(`/crm/contacts/suppliers`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAllCustomers: (data) =>
    apiRequest(`/crm/contacts/customers`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAllDistributors: (data) =>
    apiRequest(`/crm/contacts/distributors`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAllReceiptSuppliers: (data) =>
    apiRequest(`/crm/contacts/receipt-suppliers`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getRouteOutletsAvailable: (data) =>
    apiRequest(`/crm/contacts/route-outlets-available`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getRouteDistributorsAvailable: (data) =>
    apiRequest(`/crm/contacts/route-distributors-available`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  upsertAddress: (data) =>
    apiRequest("/crm/v1/contacts/upsert-address", {
      body: data,
    }),
  deleteAddress: (data) =>
    apiRequest("/crm/v1/contacts/delete-address", {
      body: data,
    }),
};
