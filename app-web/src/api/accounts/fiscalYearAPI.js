import { apiRequest } from "@/utils/api.js";

//fiscalYearAPI
export const fiscalYearAPI = {
  getAllActive: (data) =>
    apiRequest("/accounts/v1/fiscal-year/get-all-active", { body: data }),
};
