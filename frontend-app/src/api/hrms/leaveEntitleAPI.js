import { apiRequest } from "@/utils/api.js";

// leaveEntitleAPI
export const leaveEntitleAPI = {
  getAll: (data) =>
    apiRequest("/hrms/setup/leave-entitle", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/hrms/setup/leave-entitle/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/hrms/setup/leave-entitle/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/hrms/setup/leave-entitle/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAllActive: (data) =>
    apiRequest("/hrms/setup/leave-entitle/get-all-active", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
