import { apiRequest } from "@/utils/api.js";

//usersAPI
export const usersAPI = {
  getAll: (data) => apiRequest("/settings/v1/users", { body: data }),
  getMenus: (data) => apiRequest("/settings/v1/users/menus", { body: data }),
  upsertMenus: (data) => apiRequest("/settings/v1/users/menus/upsert", { body: data }),
};
