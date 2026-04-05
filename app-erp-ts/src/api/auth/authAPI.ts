import { apiRequest } from "@/utils/api";

export const authAPI = {
  login: (data: any) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: data,
    }).then((response) => {
      if (response.token) {
        localStorage.setItem("sgdwt25", response.token);
      }
      return response;
    }),
  logout: () =>
    apiRequest("/auth/logout", {
      method: "POST",
    }),
  register: (data: any) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: data,
    }),
  recoverPassword: (data: any) =>
    apiRequest("/auth/recover-password", {
      method: "POST",
      body: data,
    }),
  resetPassword: (data: any) =>
    apiRequest("/auth/reset-password", {
      method: "POST",
      body: data,
    }),
  permissionsModules: (data: any) =>
    apiRequest("/auth/permissions/modules", {
      method: "POST",
      body: data,
    }),
  permissionsMenus: (data: any) =>
    apiRequest("/auth/permissions/menus", {
      method: "POST",
      body: data,
    }),
};
