import { apiRequest } from "@/utils/api.js";

//payLocalAPI
export const payLocalAPI = {
  getAll: (data) =>
    apiRequest("/M08/v1/pay-local", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M08/v1/pay-local/create", {
      body: data,
    }),
};
