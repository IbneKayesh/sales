import { apiRequest } from "@/utils/api.js";

export const authAPI = {
  login: (data) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }).then((response) => {
      if (response.token) {
        localStorage.setItem("sgd25", response.token);
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
  resetPassword: (data) =>
    apiRequest("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
