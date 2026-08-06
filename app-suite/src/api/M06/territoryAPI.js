import { apiRequest } from "@/utils/api.js";

//territoryAPI
export const territoryAPI = {
  getAll: (data) =>
    apiRequest("/M06/v1/territories", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M06/v1/territories/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M06/v1/territories/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M06/v1/territories/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M06/v1/territories/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M06/v1/territories/get-all-active", {
      body: data,
    }),
  getByTArea: (data) =>
    apiRequest("/M06/v1/territories/get-by-tarea", {
      body: data,
    }),
};
