import { apiRequest } from "@/utils/api.js";

//shopAPI
export const shopAPI = {
  dPurchase: (data) =>
    apiRequest("/reports/shop/d-purchase", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  dSales: (data) =>
    apiRequest("/reports/shop/d-sales", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
