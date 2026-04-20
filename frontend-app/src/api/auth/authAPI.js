import { apiRequest, apiLogin } from "@/utils/api.js";

export const authAPI = {
  login2: (data) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.token) {
        localStorage.setItem("sgdwt25", response.token);
      }
      return response;
    }),
  login: (data) => {
    apiLogin({
      body: JSON.stringify(data),
    }).then((response) => {
      //return response;
    });
  },
  logout: () =>
    apiRequest("/auth/logout", {
      method: "POST",
    }),
  register: (data) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  recoverPassword: (data) =>
    apiRequest("/auth/recover-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  resetPassword: (data) =>
    apiRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  permissionsModules: (data) =>
    apiRequest("/auth/permissions/modules", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  permissionsMenus: (data) =>
    apiRequest("/auth/permissions/menus", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
