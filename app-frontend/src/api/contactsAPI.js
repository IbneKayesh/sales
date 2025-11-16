import { apiRequest } from '@/utils/api.js';

// Contacts API
export const contactsAPI = {
  getAll: () => apiRequest('/contacts'),
  getById: (id) => apiRequest(`/contacts/${id}`),
  create: (contact) => apiRequest('/contacts', {
    method: 'POST',
    body: JSON.stringify(contact),
  }),
  update: (id, contact) => apiRequest('/contacts/update', {
    method: 'POST',
    body: JSON.stringify({ id, ...contact }),
  }),
  delete: (id) => apiRequest('/contacts/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
  }),
};
