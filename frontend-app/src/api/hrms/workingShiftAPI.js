import { apiRequest } from "@/utils/api.js";

//workingShiftAPI
export const workingShiftAPI = {
  getAll: (data) =>
    apiRequest("/hrms/setup/working-shift", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/hrms/setup/working-shift/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/hrms/setup/working-shift/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/hrms/setup/working-shift/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAllActive: (data) =>
    apiRequest("/hrms/setup/working-shift/get-all-active", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
