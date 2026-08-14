import { apiRequest } from "@/utils/api.js";

//itemContactAPI
export const itemContactAPI = {
  getByItemId: (data) =>
    apiRequest("/M04/v1/item-contact/get-by-item", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M04/v1/item-contact/create", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M04/v1/item-contact/delete", {
      body: data,
    }),
};
