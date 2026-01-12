import { apiRequest } from "@/utils/api.js";

//Products API
export const productsAPI1 = {
  getAllPo2So: (filter = "po2so") =>
    apiRequest(`/inventory/products/po2so?filter=${filter}`),
  getProductLedger: (id) => apiRequest(`/inventory/products/ledger/${id}`),
  getAllBooking: () => apiRequest(`/inventory/products/booking`),
};

// products API
export const productsAPI = {
  getAll: (data) =>
    apiRequest("/inventory/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/inventory/products/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/inventory/products/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/inventory/products/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getBItem: (data) =>
    apiRequest("/inventory/products/get-bitem", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  createBItem: (data) =>
    apiRequest("/inventory/products/create-bitem", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateBItem: (data) =>
    apiRequest("/inventory/products/update-bitem", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getBusinessItems: (data) =>
    apiRequest("/inventory/products/get-business-items", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
