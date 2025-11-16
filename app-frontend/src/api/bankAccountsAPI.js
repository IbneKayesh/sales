import { apiRequest } from '@/utils/api.js';

// Bank Accounts API
export const bankAccountsAPI = {
  getAll: () => apiRequest('/bank-accounts'),
  getById: (id) => apiRequest(`/bank-accounts/${id}`),
  create: (account) => apiRequest('/bank-accounts', {
    method: 'POST',
    body: JSON.stringify(account),
  }),
  update: (id, account) => apiRequest('/bank-accounts/update', {
    method: 'POST',
    body: JSON.stringify({ id, ...account }),
  }),
  delete: (id) => apiRequest('/bank-accounts/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
  }),
};
