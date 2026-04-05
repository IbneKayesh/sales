import { apiRequest } from "@/utils/api.js";

//employeesAPI
export const employeesAPI = {
  getAll: (data) =>
    apiRequest("/hrms/employees", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/hrms/employees/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/hrms/employees/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/hrms/employees/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  availableRouteEmployees: (data) =>
    apiRequest("/hrms/employees/available-route-employees", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
