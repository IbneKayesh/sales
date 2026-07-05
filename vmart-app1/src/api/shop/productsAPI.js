import { apiRequest } from "@/utils/api.js";

// products API
export const productsAPI = {
  getAll: (data) =>
    apiRequest("/inventory/v1/items/vmart", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
