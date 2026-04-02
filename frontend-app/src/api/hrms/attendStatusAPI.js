import { apiRequest } from "@/utils/api.js";

// attendStatusAPI
export const attendStatusAPI = {
  getAll: (data) =>
    apiRequest("/hrms/setup/attend-status", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/hrms/setup/attend-status/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/hrms/setup/attend-status/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/hrms/setup/attend-status/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAllActive: (data) =>
    apiRequest("/hrms/setup/attend-status/get-all-active", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  createEmpLeave: (data) =>
    apiRequest("/hrms/setup/attend-status/create-emp-leave", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
