import { apiRequest } from "@/utils/api.js";

//reportsAPI
export const reportsAPI = {
  getTrialBalance: (data) =>
    apiRequest("/accounts/v1/reports/get-trial-balance", { body: data }),
};
