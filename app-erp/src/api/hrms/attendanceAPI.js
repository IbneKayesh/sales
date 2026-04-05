import { apiRequest } from "@/utils/api.js";

// attendanceAPI
export const attendanceAPI = {
  getAll: (data) =>
    apiRequest("/hrms/attendance", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/hrms/attendance/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/hrms/attendance/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/hrms/attendance/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAllActive: (data) =>
    apiRequest("/hrms/attendance/get-all-active", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
