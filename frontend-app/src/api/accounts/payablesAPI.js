import { apiRequest } from '@/utils/api.js';

//payables API
export const payablesAPI = {
  getAll: (data) =>
    apiRequest("/accounts/payables", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/accounts/payables/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/accounts/payables/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/accounts/payables/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getPaymentDetails: (data) =>
    apiRequest("/accounts/payables/payment-details", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getPaymentSummary: (data) =>
    apiRequest("/accounts/payables/payment-summary", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};