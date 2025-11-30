//as example unitsAPI.js
import { apiRequest } from '@/utils/api.js';

// Categories API
export const categoriesAPI = {
  getAll: () => apiRequest('/inventory/categories'),
  getById: (id) => apiRequest(`/inventory/categories/${id}`),
  create: (category) => apiRequest('/inventory/categories', {
    method: 'POST',
    body: JSON.stringify(category),
  }),
  update: (category) => apiRequest('/inventory/categories/update', {
    method: 'POST',
    body: JSON.stringify(category),
  }),
  delete: (category) => apiRequest('/inventory/categories/delete', {
    method: 'POST',
    body: JSON.stringify(category),
  }),
};