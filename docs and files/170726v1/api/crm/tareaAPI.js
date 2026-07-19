import { apiRequest } from "@/utils/api.js";

//tareaAPI
export const tareaAPI = {
  getAll: (data) =>
    apiRequest("/crm/v1/tarea", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/crm/v1/tarea/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/crm/v1/tarea/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/crm/v1/tarea/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/crm/v1/tarea/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/crm/v1/tarea/get-all-active", {
      body: data,
    }),
  getByDZone: (data) =>
    apiRequest("/crm/v1/tarea/get-by-dzone", {
      body: data,
    }),
};
