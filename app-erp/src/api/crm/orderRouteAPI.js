import { apiRequest } from "@/utils/api.js";

//orderRouteAPI
export const orderRouteAPI = {
  getAll: (data) =>
    apiRequest("/crm/order-route", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/crm/order-route/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/crm/order-route/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/crm/order-route/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  outlets: (data) =>
    apiRequest("/crm/order-route/outlets", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteOutlet: (data) =>
    apiRequest("/crm/order-route/delete-outlets", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  createOutlet: (data) =>
    apiRequest("/crm/order-route/create-outlets", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
