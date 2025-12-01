import { apiRequest } from "@/utils/api.js";

// Purchase Order Master API
export const poMasterAPI = {
  getAll: (orderType, filter = "default") =>
    apiRequest(`/po-master?orderType=${orderType}&filter=${filter}`),
};
