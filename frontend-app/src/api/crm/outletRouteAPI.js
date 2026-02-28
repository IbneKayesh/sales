import { apiRequest } from "@/utils/api.js";

//outletRouteAPI
export const outletRouteAPI = {
  getAll: (data) =>
    apiRequest("/crm/outlet-route", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/crm/outlet-route/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/crm/outlet-route/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/crm/outlet-route/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  outlets: (data) =>
    apiRequest("/crm/outlet-route/outlets", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteOutlet: (data) =>
    apiRequest("/crm/outlet-route/delete-outlets", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  createOutlet: (data) =>
    apiRequest("/crm/outlet-route/create-outlets", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
