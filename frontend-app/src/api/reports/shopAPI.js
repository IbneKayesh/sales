import { apiRequest } from "@/utils/api.js";

//shopAPI
export const shopAPI = {
  dashboard: (data) =>
    apiRequest("/reports/shop/dashboard", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
