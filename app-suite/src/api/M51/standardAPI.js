import { apiRequest } from "@/utils/api.js";

//standardAPI
export const standardAPI = {
  getStandardReport: (data) =>
    apiRequest("/M51/v1/reports/standard", {
      body: data,
    }),
};
