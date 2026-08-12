import { apiRequest } from "@/utils/api.js";

//receivablesAPI
export const receivablesAPI = {
  getAll: (data) =>
    apiRequest("/M08/v1/receivables", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M08/v1/receivables/create", {
      body: data,
    }),
};
