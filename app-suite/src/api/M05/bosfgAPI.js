import { apiRequest } from "@/utils/api.js";

//bosfgAPI
export const bosfgAPI = {
  getAll: (data) =>
    apiRequest("/M05/v1/output-sfg", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M05/v1/output-sfg/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M05/v1/output-sfg/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M05/v1/output-sfg/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M05/v1/output-sfg/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M05/v1/output-sfg/get-all-active", {
      body: data,
    }),
};
