import { apiRequest } from '@/utils/api.js';

//Payments API
export const paymentsAPI = {
  getAll: () => apiRequest('/accounts/payments'),
  
  getById: (id) => apiRequest(`/accounts/payments/${id}`),
  create: (payment) => apiRequest('/accounts/payments', {
    method: 'POST',
    body: JSON.stringify(payment),
  }),
  update: (payment) => apiRequest('/accounts/payments/update', {
    method: 'POST',
    body: JSON.stringify(payment),
  }),
  delete: (payment) => apiRequest('/accounts/payments/delete', {
    method: 'POST',
    body: JSON.stringify(payment),
  }),
};