import { apiRequest } from "@/utils/api.js";

//configs API
export const configsAPI = {
    getTransaction: (name) => apiRequest(`/setup/configs/transaction/${name}`),
}