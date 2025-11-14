// Centralized API utility for backend communication
const API_BASE_URL = '/api';

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  logout: () => apiRequest('/auth/logout', {
    method: 'POST',
  }),
};

// Banks API
export const banksAPI = {
  getAll: () => apiRequest('/banks'),
  getById: (id) => apiRequest(`/banks/${id}`),
  create: (bank) => apiRequest('/banks', {
    method: 'POST',
    body: JSON.stringify(bank),
  }),
  update: (id, bank) => apiRequest(`/banks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(bank),
  }),
  delete: (id) => apiRequest(`/banks/${id}`, {
    method: 'DELETE',
  }),
};

// Bank Accounts API
export const bankAccountsAPI = {
  getAll: () => apiRequest('/bank-accounts'),
  getById: (id) => apiRequest(`/bank-accounts/${id}`),
  create: (account) => apiRequest('/bank-accounts', {
    method: 'POST',
    body: JSON.stringify(account),
  }),
  update: (id, account) => apiRequest(`/bank-accounts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(account),
  }),
  delete: (id) => apiRequest(`/bank-accounts/${id}`, {
    method: 'DELETE',
  }),
};

// Bank Transactions API
export const bankTransactionsAPI = {
  getAll: () => apiRequest('/bank-transactions'),
  getById: (id) => apiRequest(`/bank-transactions/${id}`),
  create: (transaction) => apiRequest('/bank-transactions', {
    method: 'POST',
    body: JSON.stringify(transaction),
  }),
  update: (id, transaction) => apiRequest(`/bank-transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(transaction),
  }),
  delete: (id) => apiRequest(`/bank-transactions/${id}`, {
    method: 'DELETE',
  }),
};

// Purchase Order Master API
export const poMasterAPI = {
  getAll: () => apiRequest('/po-master'),
  getById: (id) => apiRequest(`/po-master/${id}`),
  create: (po) => apiRequest('/po-master', {
    method: 'POST',
    body: JSON.stringify(po),
  }),
  update: (id, po) => apiRequest(`/po-master/${id}`, {
    method: 'PUT',
    body: JSON.stringify(po),
  }),
  delete: (id) => apiRequest(`/po-master/${id}`, {
    method: 'DELETE',
  }),
};

// Purchase Order Child API
export const poChildAPI = {
  getAll: () => apiRequest('/po-child'),
  getByMasterId: (masterId) => apiRequest(`/po-child/master/${masterId}`),
  getById: (id) => apiRequest(`/po-child/${id}`),
  create: (poChild) => apiRequest('/po-child', {
    method: 'POST',
    body: JSON.stringify(poChild),
  }),
  update: (id, poChild) => apiRequest(`/po-child/${id}`, {
    method: 'PUT',
    body: JSON.stringify(poChild),
  }),
  delete: (id) => apiRequest(`/po-child/${id}`, {
    method: 'DELETE',
  }),
};

// Sales Order Master API
export const soMasterAPI = {
  getAll: () => apiRequest('/so-master'),
  getById: (id) => apiRequest(`/so-master/${id}`),
  create: (so) => apiRequest('/so-master', {
    method: 'POST',
    body: JSON.stringify(so),
  }),
  update: (id, so) => apiRequest(`/so-master/${id}`, {
    method: 'PUT',
    body: JSON.stringify(so),
  }),
  delete: (id) => apiRequest(`/so-master/${id}`, {
    method: 'DELETE',
  }),
};

// Sales Order Child API
export const soChildAPI = {
  getAll: () => apiRequest('/so-child'),
  getByMasterId: (masterId) => apiRequest(`/so-child/master/${masterId}`),
  getById: (id) => apiRequest(`/so-child/${id}`),
  create: (soChild) => apiRequest('/so-child', {
    method: 'POST',
    body: JSON.stringify(soChild),
  }),
  update: (id, soChild) => apiRequest(`/so-child/${id}`, {
    method: 'PUT',
    body: JSON.stringify(soChild),
  }),
  delete: (id) => apiRequest(`/so-child/${id}`, {
    method: 'DELETE',
  }),
};

// Contacts API
export const contactsAPI = {
  getAll: () => apiRequest('/contacts'),
  getById: (id) => apiRequest(`/contacts/${id}`),
  create: (contact) => apiRequest('/contacts', {
    method: 'POST',
    body: JSON.stringify(contact),
  }),
  update: (id, contact) => apiRequest(`/contacts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(contact),
  }),
  delete: (id) => apiRequest(`/contacts/${id}`, {
    method: 'DELETE',
  }),
};

// Units API
export const unitsAPI = {
  getAll: () => apiRequest('/units'),
  getById: (id) => apiRequest(`/units/${id}`),
  create: (unit) => apiRequest('/units', {
    method: 'POST',
    body: JSON.stringify(unit),
  }),
  update: (id, unit) => apiRequest(`/units/${id}`, {
    method: 'PUT',
    body: JSON.stringify(unit),
  }),
  delete: (id) => apiRequest(`/units/${id}`, {
    method: 'DELETE',
  }),
};

// Items API
export const itemsAPI = {
  getAll: () => apiRequest('/items'),
  getById: (id) => apiRequest(`/items/${id}`),
  create: (item) => apiRequest('/items', {
    method: 'POST',
    body: JSON.stringify(item),
  }),
  update: (id, item) => apiRequest(`/items/${id}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  }),
  delete: (id) => apiRequest(`/items/${id}`, {
    method: 'DELETE',
  }),
};
