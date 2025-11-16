import { apiRequest } from '@/utils/api.js';

// Categories API
export const categoriesAPI = {
  getAll: () => apiRequest('/categories', {
    method: 'GET',
  }),
  getById: (id) => apiRequest(`/categories/${id}`, {
    method: 'GET',
  }),
  create: (categoryData) => apiRequest('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  }),
  update: (id, categoryData) => apiRequest('/categories/update', {
    method: 'POST',
    body: JSON.stringify({
      id,
      category_name: categoryData.category_name,
    }),
  }),
  delete: (id) => apiRequest('/categories/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
  }),
};
