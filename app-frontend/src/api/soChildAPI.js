import { apiRequest } from '@/utils/api.js';

// Sales Order Child API
export const soChildAPI = {
  getAll: () => apiRequest('/so-child'),
  getByMasterId: (masterId) => apiRequest(`/so-child/master/${masterId}`),
  getById: (id) => apiRequest(`/so-child/${id}`),
  create: (soChild) => apiRequest('/so-child', {
    method: 'POST',
    body: JSON.stringify(soChild),
  }),
  update: (id, soChild) => apiRequest('/so-child/update', {
    method: 'POST',
    body: JSON.stringify({ id, ...soChild }),
  }),
  delete: (id) => apiRequest('/so-child/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
  }),
};
