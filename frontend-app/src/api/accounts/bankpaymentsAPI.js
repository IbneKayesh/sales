import { apiRequest } from '@/utils/api.js';

//Bank Payments API
export const bankpaymentsAPI = {
  getAllPurchaseDues: () => apiRequest('/accounts/bankpayments/purchase-dues'),
  
  getById: (id) => apiRequest(`/accounts/bankpayments/${id}`),
  create: (bankpayment) => apiRequest('/accounts/bankpayments', {
    method: 'POST',
    body: JSON.stringify(bankpayment),
  }),
  update: (bankpayment) => apiRequest('/accounts/bankpayments/update', {
    method: 'POST',
    body: JSON.stringify(bankpayment),
  }),
  delete: (bankpayment) => apiRequest('/accounts/bankpayments/delete', {
    method: 'POST',
    body: JSON.stringify(bankpayment),
  }),
};