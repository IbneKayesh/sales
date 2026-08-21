import { apiRequest } from "@/utils/api.js";

//itemTaxAPI
export const itemTaxAPI = {
  getByItemId: (data) =>
    apiRequest("/M04/v1/item-tax/get-by-item", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M04/v1/item-tax/create", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M04/v1/item-tax/delete", {
      body: data,
    }),
  createCategory: (data) =>
    apiRequest("/M04/v1/item-tax/create-category", {
      body: data,
    }),
  getByItemIdPurchase: (data) =>
    apiRequest("/M04/v1/item-tax/get-by-item-purchase", {
      body: data,
    }),
};
