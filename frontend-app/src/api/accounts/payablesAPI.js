import { apiRequest } from '@/utils/api.js';

//payables API
export const payablesAPI = {
  getAll: () => apiRequest('/accounts/payables'),

  create: (payment) => apiRequest('/accounts/payables/create', {
    method: 'POST',
    body: JSON.stringify(payment),
  }),

  update: (payment) => apiRequest('/accounts/payables/update', {
    method: 'PUT',
    body: JSON.stringify(payment),
  }),

  delete: (payment) => apiRequest('/accounts/payables/delete', {
    method: 'DELETE',
    body: JSON.stringify(payment),
  }),
};