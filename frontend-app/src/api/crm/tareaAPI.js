import { apiRequest } from "@/utils/api.js";

//tarea API
export const tareaAPI = {
  getAll: (data) =>
    apiRequest("/crm/tarea", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/crm/tarea/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/crm/tarea/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/crm/tarea/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getByZone: (data) =>
    apiRequest("/crm/tarea/get-by-dzone", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
