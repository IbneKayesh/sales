import { apiRequest } from "@/utils/api.js";

//Users API
export const settingsAPI = {
  getAll: () => apiRequest("/setup/settings"),
  getByPageId: (id) => apiRequest(`/setup/settings/${id}`),
  update: (user) =>
    apiRequest("/setup/settings/update", {
      method: "POST",
      body: JSON.stringify(user),
    }),
};
