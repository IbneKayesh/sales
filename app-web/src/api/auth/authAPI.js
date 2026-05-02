import { apiRequest, apiLogin } from "@/utils/api.js";

export const authAPI = {
  login: (data) => apiLogin({ body: data }),
};
