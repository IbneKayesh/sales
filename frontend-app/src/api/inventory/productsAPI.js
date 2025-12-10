//as example unitsAPI.js
import { apiRequest } from '@/utils/api.js';

//Products API
export const productsAPI = {
  getAll: (filter = "default") => apiRequest(`/inventory/products?filter=${filter}`),
  getAllPo2So: (filter = "po2so") => apiRequest(`/inventory/products/po2so?filter=${filter}`),
  getById: (id) => apiRequest(`/inventory/products/${id}`),
  create: (product) => apiRequest('/inventory/products', {
    method: 'POST',
    body: JSON.stringify(product),
  }),
  update: (product) => apiRequest('/inventory/products/update', {
    method: 'POST',
    body: JSON.stringify(product),
  }),
  delete: (product) => apiRequest('/inventory/products/delete', {
    method: 'POST',
    body: JSON.stringify(product),
  }),
  getProductLedger: (id) => apiRequest(`/inventory/products/ledger/${id}`),
};