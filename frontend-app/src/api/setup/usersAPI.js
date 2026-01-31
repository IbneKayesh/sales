import { apiRequest } from "@/utils/api.js";

//usersAPI
export const usersAPI = {
  getAll: (data) =>
    apiRequest("/setup/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (user) =>
    apiRequest("/setup/users/create", {
      method: "POST",
      body: JSON.stringify(user),
    }),
  update: (user) =>
    apiRequest("/setup/users/update", {
      method: "POST",
      body: JSON.stringify(user),
    }),
  delete: (user) =>
    apiRequest("/setup/users/delete", {
      method: "POST",
      body: JSON.stringify(user),
    }),
  changePassword: (data) =>
    apiRequest("/setup/users/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
