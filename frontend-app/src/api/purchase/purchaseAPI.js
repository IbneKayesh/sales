import { apiRequest } from "@/utils/api.js";

//Purchase API
export const purchaseAPI = {
getAll: () => apiRequest('/purchase/orders'),
}