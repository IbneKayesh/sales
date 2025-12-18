import { apiRequest } from '@/utils/api.js';

//Bank Accounts API
export const bankaccountsAPI = {
  getAll: () => apiRequest('/accounts/bankaccounts'),
  getById: (id) => apiRequest(`/accounts/bankaccounts/${id}`),
  getSubAccounts: (account_id) => apiRequest(`/accounts/bankaccounts/subaccounts/${account_id}`),
  create: (bankaccount) => apiRequest('/accounts/bankaccounts', {
    method: 'POST',
    body: JSON.stringify(bankaccount),
  }),
  update: (bankaccount) => apiRequest('/accounts/bankaccounts/update', {
    method: 'POST',
    body: JSON.stringify(bankaccount),
  }),
  delete: (bankaccount) => apiRequest('/accounts/bankaccounts/delete', {
    method: 'POST',
    body: JSON.stringify(bankaccount),
  }),
};