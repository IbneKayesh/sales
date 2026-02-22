import { apiRequest } from "@/utils/api.js";

//territoryAPI
export const territoryAPI = {
  getAll: (data) =>
    apiRequest("/crm/territory", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/crm/territory/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/crm/territory/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/crm/territory/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getByArea: (data) =>
    apiRequest("/crm/territory/get-by-tarea", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
