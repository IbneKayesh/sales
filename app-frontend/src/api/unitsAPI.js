import { apiRequest } from '@/utils/api.js';

// Units API
export const unitsAPI = {
  getAll: () => apiRequest('/units'),
  getById: (id) => apiRequest(`/units/${id}`),
  create: (unit) => apiRequest('/units', {
    method: 'POST',
    body: JSON.stringify(unit),
  }),
  update: (id, unit) => apiRequest('/units/update', {
    method: 'POST',
    body: JSON.stringify({ id, ...unit }),
  }),
  delete: (id) => apiRequest('/units/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
  }),
};
