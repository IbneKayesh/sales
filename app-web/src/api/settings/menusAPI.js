import { apiRequest } from "@/utils/api.js";

//menusAPI
export const menusAPI = {
  getMenus: (data) => apiRequest("/settings/v1/menus", { body: data }),
  upsertMenus: (data) =>
    apiRequest("/settings/v1/menus/upsert", { body: data }),
};
