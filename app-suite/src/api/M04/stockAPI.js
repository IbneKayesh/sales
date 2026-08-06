import { apiRequest } from "@/utils/api.js";

//stockAPI
export const stockAPI = {
  getAvailable: (data) =>
    apiRequest("/M04/v1/stock/available", {
      body: data,
    }),
};
