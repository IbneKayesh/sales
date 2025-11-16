import { apiRequest } from '@/utils/api.js';

// Users API
export const usersAPI = {
  getAll: () => apiRequest('/users', {
    method: 'GET',
  }),
  getById: (id) => apiRequest(`/users/${id}`, {
    method: 'GET',
  }),
  create: (userData) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  update: (id, userData) => apiRequest('/users/update', {
    method: 'POST',
    body: JSON.stringify({
      id,
      username: userData.username,
      password: userData.password,
      email: userData.email,
      role: userData.role,
    }),
  }),
  delete: (id) => apiRequest('/users/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
  }),
  changePassword: (userId, currentPassword, newPassword) => apiRequest('/users/change-password', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      current_password: currentPassword,
      new_password: newPassword,
    }),
  }),
};
