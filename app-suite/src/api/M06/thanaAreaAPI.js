import { apiRequest } from "@/utils/api.js";

//thanaAreaAPI
export const thanaAreaAPI = {
  getAll: (data) =>
    apiRequest("/M06/v1/tareas", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M06/v1/tareas/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M06/v1/tareas/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M06/v1/tareas/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M06/v1/tareas/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M06/v1/tareas/get-all-active", {
      body: data,
    }),
  getByZone: (data) =>
    apiRequest("/M06/v1/tareas/get-by-dzone", {
      body: data,
    }),
};
