import { apiRequest } from "@/utils/api.js";

//dzoneAPI
export const dzoneAPI = {
  getAll: (data) =>
    apiRequest("/crm/v1/dzone", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/crm/v1/dzone/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/crm/v1/dzone/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/crm/v1/dzone/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/crm/v1/dzone/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/crm/v1/dzone/get-all-active", {
      body: data,
    }),
  getByCountry: (data) =>
    apiRequest("/crm/v1/dzone/get-by-country", {
      body: data,
    }),
};
