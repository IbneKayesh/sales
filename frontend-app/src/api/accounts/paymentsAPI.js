import { apiRequest } from '@/utils/api.js';

//Payments API
export const paymentsAPI = {
  accountsPayableDuesSuppliers: () => apiRequest('/accounts/payments/accounts-payable-dues-suppliers'),
  
  accountsPayableDuesSuppliersCreate: (payment) => apiRequest('/accounts/payments/accounts-payable-dues-suppliers-create', {
    method: 'POST',
    body: JSON.stringify(payment),
  }),
};