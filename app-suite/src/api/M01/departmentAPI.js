import { apiRequest } from "@/utils/api.js";

//departmentAPI
export const departmentAPI = {
  getAll: (data) =>
    apiRequest("/M01/v1/departments", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M01/v1/departments/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M01/v1/departments/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M01/v1/departments/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M01/v1/departments/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M01/v1/departments/get-all-active", {
      body: data,
    }),
};
