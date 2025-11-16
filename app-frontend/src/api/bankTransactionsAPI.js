import { apiRequest } from '@/utils/api.js';

// Bank Transactions API
export const bankTransactionsAPI = {
  getAll: () => apiRequest('/bank-transactions'),
  getById: (id) => apiRequest(`/bank-transactions/${id}`),
  create: (transaction) => apiRequest('/bank-transactions', {
    method: 'POST',
    body: JSON.stringify(transaction),
  }),
  update: (id, transaction) => apiRequest('/bank-transactions/update', {
    method: 'POST',
    body: JSON.stringify({ id, ...transaction }),
  }),
  delete: (id) => apiRequest('/bank-transactions/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
  }),
};
