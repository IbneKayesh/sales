import { apiRequest } from "@/utils/api.js";

//acPeriodAPI
export const acPeriodAPI = {
  getAllActive: (data) =>
    apiRequest("/accounts/v1/account-period/get-all-active", { body: data }),
  getAllPeriod: (data) =>
    apiRequest("/accounts/v1/account-period/get-all-period", { body: data }),
};
