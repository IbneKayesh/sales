import { apiRequest } from '@/utils/api.js';

// Sales Order Master API
export const soMasterAPI = {
  getAll: () => apiRequest('/so-master'),
  getById: (id) => apiRequest(`/so-master/${id}`),
  create: (so) => apiRequest('/so-master', {
    method: 'POST',
    body: JSON.stringify(so),
  }),
  update: (id, so) => apiRequest('/so-master/update', {
    method: 'POST',
    body: JSON.stringify({ id, ...so }),
  }),
  delete: (id) => apiRequest('/so-master/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
  }),
};
