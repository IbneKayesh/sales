import { apiRequest } from "@/utils/api.js";

//businessAPI
export const businessAPI = {
  getAll: (data) =>
    apiRequest("/setup/business", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/setup/business/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/setup/business/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/setup/business/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
