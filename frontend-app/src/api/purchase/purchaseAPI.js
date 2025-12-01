import { apiRequest } from "@/utils/api.js";

//Purchase API
export const purchaseAPI = {
  getAll: (poType, filter) => apiRequest(`/purchase/orders?poType=${poType}&filter=${filter}`),
};
