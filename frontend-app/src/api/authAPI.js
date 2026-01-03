import { apiRequest } from '@/utils/api.js';

// Authentication API
export const authAPI = {
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  logout: () => apiRequest('/auth/logout', {
    method: 'POST',
  }),
  register: (register) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(register),
  }),
};
