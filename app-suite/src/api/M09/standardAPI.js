import { apiRequest } from "@/utils/api.js";

//standardAPI
export const standardAPI = {
  getStandardReport: (data) =>
    apiRequest("/M09/v1/reports/standard", {
      body: data,
    }),
};
