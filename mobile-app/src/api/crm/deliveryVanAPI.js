import { apiRequest } from "@/utils/api.js";

//deliveryVanAPI
export const deliveryVanAPI = {
  getAll: (data) =>
    apiRequest("/crm/delivery-van", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/crm/delivery-van/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/crm/delivery-van/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/crm/delivery-van/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
