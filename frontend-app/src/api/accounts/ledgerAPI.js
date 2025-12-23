import { apiRequest } from '@/utils/api.js';

//Ledger API
export const ledgerAPI = {
  getAll: () => apiRequest('/accounts/ledger'),
  
  getById: (id) => apiRequest(`/accounts/ledger/${id}`),
  create: (ledger) => apiRequest('/accounts/ledger', {
    method: 'POST',
    body: JSON.stringify(ledger),
  }),
  update: (ledger) => apiRequest('/accounts/ledger/update', {
    method: 'POST',
    body: JSON.stringify(ledger),
  }),
  delete: (ledger) => apiRequest('/accounts/ledger/delete', {
    method: 'POST',
    body: JSON.stringify(ledger),
  }),
  createTransfer: (ledger) => apiRequest('/accounts/ledger/create-transfer', {
    method: 'POST',
    body: JSON.stringify(ledger),
  }),
};