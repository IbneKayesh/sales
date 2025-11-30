import { apiRequest } from "@/utils/api.js";

//Contacts API
export const contactAPI = {
getAll: () => apiRequest('/setup/contacts'),
getById: (id) => apiRequest(`/setup/contacts/${id}`),
create: (contact) => apiRequest('/setup/contacts', {
    method: 'POST',
    body: JSON.stringify(contact),
}),
update: (contact) => apiRequest('/setup/contacts/update', {
    method: 'POST',
    body: JSON.stringify(contact),
}),
delete: (contact) => apiRequest('/setup/contacts/delete', {
    method: 'POST',
    body: JSON.stringify(contact),
}),
}