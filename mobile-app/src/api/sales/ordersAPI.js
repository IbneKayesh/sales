import { apiRequest } from "@/utils/api.js";

//ordersAPI
export const ordersAPI = {
  getAll: (data) =>
    apiRequest("/mobile/sales/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};