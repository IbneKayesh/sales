// Centralized API utility for backend communication
const API_BASE_URL = '/api';

const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'api-hard-code-key': 'my-secret-key-12345',
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
  update: (id, bank) => apiRequest('/banks/update', {
    method: 'POST',
    body: JSON.stringify({ id, ...bank }),
  }),
  delete: (id) => apiRequest('/banks/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
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
  update: (id, account) => apiRequest('/bank-accounts/update', {
    method: 'POST',
    body: JSON.stringify({ id, ...account }),
  }),
  delete: (id) => apiRequest('/bank-accounts/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
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
  update: (id, transaction) => apiRequest('/bank-transactions/update', {
    method: 'POST',
    body: JSON.stringify({ id, ...transaction }),
  }),
  delete: (id) => apiRequest('/bank-transactions/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
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
  update: (id, po) => apiRequest('/po-master/update', {
    method: 'POST',
    body: JSON.stringify({ id, ...po }),
  }),
  delete: (id) => apiRequest('/po-master/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
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
  update: (id, poChild) => apiRequest('/po-child/update', {
    method: 'POST',
    body: JSON.stringify({ id, ...poChild }),
  }),
  delete: (id) => apiRequest('/po-child/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
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
  update: (id, so) => apiRequest('/so-master/update', {
    method: 'POST',
    body: JSON.stringify({ id, ...so }),
  }),
  delete: (id) => apiRequest('/so-master/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
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
  update: (id, soChild) => apiRequest('/so-child/update', {
    method: 'POST',
    body: JSON.stringify({ id, ...soChild }),
  }),
  delete: (id) => apiRequest('/so-child/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
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
  update: (id, contact) => apiRequest('/contacts/update', {
    method: 'POST',
    body: JSON.stringify({ id, ...contact }),
  }),
  delete: (id) => apiRequest('/contacts/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
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
  update: (id, unit) => apiRequest('/units/update', {
    method: 'POST',
    body: JSON.stringify({ id, ...unit }),
  }),
  delete: (id) => apiRequest('/units/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
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
  update: (id, item) => apiRequest('/items/update', {
    method: 'POST',
    body: JSON.stringify({ id, ...item }),
  }),
  delete: (id) => apiRequest('/items/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
  }),
};

// Categories API
export const categoriesAPI = {
  getAll: () => apiRequest('/categories'),
  getById: (id) => apiRequest(`/categories/${id}`),
  create: (category) => apiRequest('/categories', {
    method: 'POST',
    body: JSON.stringify(category),
  }),
  update: (id, category) => apiRequest('/categories/update', {
    method: 'POST',
    body: JSON.stringify({ id, ...category }),
  }),
  delete: (id) => apiRequest('/categories/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
  }),
};

// Users API
export const usersAPI = {
  getAll: () => apiRequest('/users'),
  getById: (id) => apiRequest(`/users/${id}`),
  create: (user) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(user),
  }),
  update: (id, user) => apiRequest('/users/update', {
    method: 'POST',
    body: JSON.stringify({ id, ...user }),
  }),
  delete: (id) => apiRequest('/users/delete', {
    method: 'POST',
    body: JSON.stringify({ id }),
  }),
};
