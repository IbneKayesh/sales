import { apiRequest } from '@/utils/api.js';

//receivablesAPI
export const receivablesAPI = {
  getAll: (data) =>
    apiRequest("/accounts/receivables", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/accounts/receivables/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/accounts/receivables/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/accounts/receivables/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getPaymentDetails: (data) =>
    apiRequest("/accounts/receivables/payment-details", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};