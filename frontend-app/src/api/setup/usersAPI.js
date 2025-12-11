import { apiRequest } from "@/utils/api.js";

//Users API
export const usersAPI = {
    getAll: () => apiRequest('/setup/users'),
    getById: (id) => apiRequest(`/setup/users/${id}`),
    create: (user) => apiRequest('/setup/users', {
        method: 'POST',
        body: JSON.stringify(user),
    }),
    update: (user) => apiRequest('/setup/users/update', {
        method: 'POST',
        body: JSON.stringify(user),
    }),
    delete: (user) => apiRequest('/setup/users/delete', {
        method: 'POST',
        body: JSON.stringify(user),
    }),
    changePassword: (user) => apiRequest('/setup/users/change-password', {
        method: 'POST',
        body: JSON.stringify(user),
    }),
}