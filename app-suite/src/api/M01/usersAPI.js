import { apiRequest } from "@/utils/api.js";

//usersAPI
export const usersAPI = {
  getAll: (data) =>
    apiRequest("/M01/v1/users", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M01/v1/users/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M01/v1/users/delete", {
      body: data,
    }),
  getMenusUser: (data) =>
    apiRequest("/M01/v1/users/get-menus-user", {
      body: data,
    }),
  updateMenusUser: (data) =>
    apiRequest("/M01/v1/users/update-menus-user", {
      body: data,
    }),
};
