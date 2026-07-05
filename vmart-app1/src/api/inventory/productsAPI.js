import { apiRequest } from "@/utils/api.js";

// products API
export const productsAPI = {
  getSalesOrderItems: (data) =>
    apiRequest("/mobile/inventory/products/get-sales-order-items", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
