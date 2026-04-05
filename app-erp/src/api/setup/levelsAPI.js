import { apiRequest } from "@/utils/api.js";

//levelsAPI.js
export const levelsAPI = {
  getAll: (data) =>
    apiRequest("/v7/1/data?key=tm_role", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/setup/business/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/v4/1/update/20?key=tm_role", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/setup/business/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAllActive: (data) =>
    apiRequest("/setup/business/get-all-active", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};