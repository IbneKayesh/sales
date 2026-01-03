import { apiRequest } from "@/utils/api.js";

//Shops API
export const shopsAPI = {
    getAll: () => apiRequest('/setup/shops'),
    getById: (id) => apiRequest(`/setup/shops/${id}`),
    create: (shop) => apiRequest('/setup/shops', {
        method: 'POST',
        body: JSON.stringify(shop),
    }),
    update: (shop) => apiRequest('/setup/shops/update', {
        method: 'POST',
        body: JSON.stringify(shop),
    }),
    delete: (shop) => apiRequest('/setup/shops/delete', {
        method: 'POST',
        body: JSON.stringify(shop),
    }),
}