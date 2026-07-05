import { apiRequest } from "@/utils/api.js";

//businessAPI
export const businessAPI = {
  getAllActive: (data) =>
    apiRequest("/settings/v1/business/get-all-active", { body: data }),
};
