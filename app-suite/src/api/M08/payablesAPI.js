import { apiRequest } from "@/utils/api.js";

//payablesAPI
export const payablesAPI = {
  getAll: (data) =>
    apiRequest("/M08/v1/payables", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M08/v1/payables/create", {
      body: data,
    }),
};
