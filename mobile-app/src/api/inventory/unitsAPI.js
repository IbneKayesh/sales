import { apiRequest } from '@/utils/api.js';

// Units API
export const unitsAPI = {
  getAll: (data) =>
    apiRequest("/inventory/units", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/inventory/units/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/inventory/units/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/inventory/units/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
