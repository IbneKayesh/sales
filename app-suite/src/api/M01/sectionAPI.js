import { apiRequest } from "@/utils/api.js";

//sectionAPI
export const sectionAPI = {
  getAll: (data) =>
    apiRequest("/M01/v1/sections", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M01/v1/sections/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M01/v1/sections/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M01/v1/sections/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M01/v1/sections/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M01/v1/sections/get-all-active", {
      body: data,
    }),
};
