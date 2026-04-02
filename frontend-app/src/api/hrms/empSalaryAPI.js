import { apiRequest } from "@/utils/api.js";

//empSalaryAPI
export const empSalaryAPI = {
  getAll: (data) =>
    apiRequest("/hrms/employees/salary", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/hrms/employees/salary/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/hrms/employees/salary/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/hrms/employees/salary/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
