import { apiRequest } from "@/utils/api.js";

//Users API
export const settingsAPI = {
    getAll: () => apiRequest('/setup/settings'),
    update: (user) => apiRequest('/setup/settings/update', {
        method: 'POST',
        body: JSON.stringify(user),
    }),
}