import { apiRequest } from "@/utils/api.js";

//fieldrouteAPI
export const fieldrouteAPI = {
  getAll: (data) =>
    apiRequest("/crm/fieldroute", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/crm/fieldroute/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/crm/fieldroute/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/crm/fieldroute/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
