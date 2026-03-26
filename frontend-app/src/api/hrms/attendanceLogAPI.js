import { apiRequest } from "@/utils/api.js";

// attendanceLogAPI
export const attendanceLogAPI = {
  getAll: (data) =>
    apiRequest("/hrms/attendance/attendance-log", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/hrms/attendance/attendance-log/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/hrms/attendance/attendance-log/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
