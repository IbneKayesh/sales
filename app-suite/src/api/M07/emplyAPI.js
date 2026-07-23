import { apiRequest } from "@/utils/api.js";

//emplyAPI
export const emplyAPI = {
  getAll: (data) =>
    apiRequest("/M07/v1/employees", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M07/v1/employees/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M07/v1/employees/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M07/v1/employees/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M07/v1/employees/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M07/v1/employees/get-all-active", {
      body: data,
    }),
};
