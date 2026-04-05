import { apiRequest } from "@/utils/api.js";

//Purchase API
export const purchaseAPI = {
  getAll: (poType, filter) => apiRequest(`/purchase/orders?poType=${poType}&filter=${filter}`),
  create: (order) => apiRequest('/purchase/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  }),
  update: (order) => apiRequest('/purchase/orders/update', {
    method: 'POST',
    body: JSON.stringify(order),
  }),
  delete: (order) => apiRequest('/purchase/orders/delete', {
    method: 'POST',
    body: JSON.stringify(order),
  }),
  getDetails: (po_master_id) => apiRequest(`/purchase/orders/details/${po_master_id}`),
  getPayments: (order_no) => apiRequest(`/purchase/orders/payments/${order_no}`),
};
