import { apiRequest } from "@/utils/api.js";

//deliveryZoneAPI
export const deliveryZoneAPI = {
  getAll: (data) =>
    apiRequest("/contacts/v1/delivery-zones", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/contacts/v1/delivery-zones/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/contacts/v1/delivery-zones/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/contacts/v1/delivery-zones/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/contacts/v1/delivery-zones/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/contacts/v1/delivery-zones/get-all-active", {
      body: data,
    }),
};
