import { apiRequest } from "@/utils/api.js";

//businessAPI
export const configsAPI = {
  getAll: (data) =>
    apiRequest("/setup/configs", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
