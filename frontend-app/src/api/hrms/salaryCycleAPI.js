import { apiRequest } from "@/utils/api.js";

//salaryCycleAPI
export const salaryCycleAPI = {
  getAll: (data) =>
    apiRequest("/hrms/setup/salary-cycle", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/hrms/setup/salary-cycle/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/hrms/setup/salary-cycle/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/hrms/setup/salary-cycle/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAllActive: (data) =>
    apiRequest("/hrms/setup/salary-cycle/get-all-active", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
