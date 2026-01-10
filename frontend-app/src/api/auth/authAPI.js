import { apiRequest } from "@/utils/api.js";

export const authAPI = {
  login: (data) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.token) {
        localStorage.setItem("authToken", response.token);
      }
      return response;
    }),
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
  setPassword: (data) =>
    apiRequest("/auth/set-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  changePassword: (data) =>
    apiRequest("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
