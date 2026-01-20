import { apiRequest } from "@/utils/api.js";

// socialAPI
export const socialAPI = {
  getAll: (data) =>
    apiRequest("/support/socials", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
