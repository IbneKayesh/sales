import { apiRequest } from '@/utils/api.js';

// Payments API
export const paymentsAPI = {
  getAll: () => apiRequest('/payments'),
  getById: (id) => apiRequest(`/payments/${id}`),
  getByRefNo: (refNo) => apiRequest(`/payments/refno/${refNo}`),
  getBySupplierId: (supplierId) => apiRequest(`/payments/supplier/${supplierId}`),
  create: (payment) => apiRequest('/payments', {
    method: 'POST',
    body: JSON.stringify(payment),
  }),
  update: (id, payment) => apiRequest('/payments/update', {
    method: 'POST',
    body: JSON.stringify({ id, ...payment }),
  }),
  delete: (id) => apiRequest('/payments/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
  }),
};
