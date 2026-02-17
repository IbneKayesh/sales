import { apiRequest } from "@/utils/api.js";

//shopAPI
export const shopAPI = {
  summary: (data) =>
    apiRequest("/reports/shop/summary", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
