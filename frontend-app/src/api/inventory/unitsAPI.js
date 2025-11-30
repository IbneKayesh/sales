import { apiRequest } from '@/utils/api.js';

// Units API
export const unitsAPI = {
  getAll: () => apiRequest('/inventory/units'),
  getById: (id) => apiRequest(`/inventory/units/${id}`),
  create: (unit) => apiRequest('/inventory/units', {
    method: 'POST',
    body: JSON.stringify(unit),
  }),
  update: (unit) => apiRequest('/inventory/units/update', {
    method: 'POST',
    body: JSON.stringify(unit),
  }),
  delete: (unit) => apiRequest('/inventory/units/delete', {
    method: 'POST',
    body: JSON.stringify(unit),
  }),
};
