import { apiRequest } from "@/utils/api.js";

//expCategoryAPI
export const expCategoryAPI = {
  getAll: (data) =>
    apiRequest("/accounts/expenses/category", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/accounts/expenses/category/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/accounts/expenses/category/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/accounts/expenses/category/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),    
  getAllActive: (data) =>
    apiRequest("/accounts/expenses/category/get-all-active", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
