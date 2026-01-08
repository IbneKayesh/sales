import { apiRequest } from "@/utils/api.js";

//Users API
export const usersAPI = {
  getAll: (data) =>
    apiRequest("/auth/users", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (user) =>
    apiRequest("/auth/users/create", {
      method: "POST",
      body: JSON.stringify(user),
    }),
  update: (user) =>
    apiRequest("/auth/users/update", {
      method: "POST",
      body: JSON.stringify(user),
    }),
  delete: (user) =>
    apiRequest("/auth/users/delete", {
      method: "POST",
      body: JSON.stringify(user),
    }),
};
