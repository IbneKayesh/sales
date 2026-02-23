import { apiRequest } from "@/utils/api.js";

//Contacts API
export const contactAPI = {
  getAll: (data) =>
    apiRequest("/crm/contacts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/crm/contacts/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/crm/contacts/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/crm/contacts/delete", {
      method: "POST",
      body: JSON.stringify(data),
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
};
