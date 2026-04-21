import { apiRequest, apiLogin } from "@/utils/api.js";

export const authAPI = {
  login: (data) => apiLogin({ body: data }),
  register: (data) =>
    apiRequest("/auth/register", {
      body: JSON.stringify(data),
    }),
  recoverPassword: (data) =>
    apiRequest("/auth/recover-password", {
      body: JSON.stringify(data),
    }),
  resetPassword: (data) =>
    apiRequest("/auth/reset-password", {
      body: JSON.stringify(data),
    }),
  permissionsModules: (data) => apiRequest("/auth/v1/modules", { body: data }),
  permissionsMenus: (data) => apiRequest("/auth/v1/menus", { body: data }),
};
