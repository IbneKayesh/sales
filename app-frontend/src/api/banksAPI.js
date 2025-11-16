import { apiRequest } from '@/utils/api.js';

// Banks API
export const banksAPI = {
  getAll: () => apiRequest('/banks'),
  getById: (id) => apiRequest(`/banks/${id}`),
  create: (bank) => apiRequest('/banks', {
    method: 'POST',
    body: JSON.stringify(bank),
  }),
  update: (id, bank) => apiRequest('/banks/update', {
    method: 'POST',
    body: JSON.stringify({ id, ...bank }),
  }),
  delete: (id) => apiRequest('/banks/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
  }),
};
