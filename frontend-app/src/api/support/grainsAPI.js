import { apiRequest } from "@/utils/api.js";

//grainsAPI
export const grainsAPI = {
  getAll: (data) =>
    apiRequest("/support/grains", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  generateGrain: (data) =>
    apiRequest("/support/grains/generate", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};