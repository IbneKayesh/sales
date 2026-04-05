import { apiRequest } from "@/utils/api.js";

//dzone API
export const dzoneAPI = {
  getAll: (data) =>
    apiRequest("/crm/dzone", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/crm/dzone/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/crm/dzone/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/crm/dzone/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getByCountry: (data) =>
    apiRequest("/crm/dzone/get-by-country", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
