import { apiRequest } from "@/utils/api.js";

//Shops API
export const businessAPI = {
  getAll: (data) =>
    apiRequest("/auth/business", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/auth/business/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/auth/business/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/auth/business/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
