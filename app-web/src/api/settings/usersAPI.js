import { apiRequest } from "@/utils/api.js";

//usersAPI
export const usersAPI = {
  getAll: (data) => apiRequest("/settings/v1/users", { body: data }),
  upsert: (data) =>
    apiRequest("/settings/v1/users/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/settings/v1/users/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/settings/v1/users/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/settings/v1/users/delete", {
      body: data,
    }),
  changePassword: (data) =>
    apiRequest("/settings/v1/users/change-password", {
      body: data,
    }),
};
