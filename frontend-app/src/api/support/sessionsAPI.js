import { apiRequest } from "@/utils/api.js";

//SessionsAPI
export const sessionsAPI = {
  getAll: (data) =>
    apiRequest("/support/sessions/all", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/support/sessions/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
