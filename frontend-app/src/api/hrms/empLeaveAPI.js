import { apiRequest } from "@/utils/api.js";

// empLeaveAPI
export const empLeaveAPI = {
  getAll: (data) =>
    apiRequest("/hrms/attendance/emp-leave", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/hrms/attendance/emp-leave/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/hrms/attendance/emp-leave/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/hrms/attendance/emp-leave/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAllActive: (data) =>
    apiRequest("/hrms/attendance/emp-leave/get-all-active", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
