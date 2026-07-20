import { apiRequest } from "@/utils/api.js";

//bomAPI
export const bomAPI = {
  getAll: (data) =>
    apiRequest("/M05/v1/bom", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M05/v1/bom/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M05/v1/bom/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M05/v1/bom/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M05/v1/bom/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M05/v1/bom/get-all-active", {
      body: data,
    }),
};
