import { apiRequest } from "@/utils/api.js";

//Sales API
export const salesAPI = {
  getAll: (soType, filter) => apiRequest(`/sales/orders?soType=${soType}&filter=${filter}`),
  create: (order) => apiRequest('/sales/orders', {
    method: 'POST',
    body: JSON.stringify(order),
  }),
  update: (order) => apiRequest('/sales/orders/update', {
    method: 'POST',
    body: JSON.stringify(order),
  }),
  delete: (order) => apiRequest('/sales/orders/delete', {
    method: 'POST',
    body: JSON.stringify(order),
  }),
  getDetails: (so_master_id) => apiRequest(`/sales/orders/details/${so_master_id}`),
  getPayments: (order_no) => apiRequest(`/sales/orders/payments/${order_no}`),
};
