import { apiRequest } from "@/utils/api.js";

// holidaysAPI
export const holidaysAPI = {
  getAll: (data) =>
    apiRequest("/hrms/setup/holidays", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/hrms/setup/holidays/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/hrms/setup/holidays/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/hrms/setup/holidays/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAllActive: (data) =>
    apiRequest("/hrms/setup/holidays/get-all-active", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
