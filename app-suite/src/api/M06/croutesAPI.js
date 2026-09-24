import { apiRequest } from "@/utils/api.js";

//croutesAPI
export const croutesAPI = {
  getAll: (data) =>
    apiRequest("/M06/v1/croutes", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M06/v1/croutes/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M06/v1/croutes/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M06/v1/croutes/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M06/v1/croutes/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M06/v1/croutes/get-all-active", {
      body: data,
    }),
  getByCRoutes: (data) =>
    apiRequest("/M06/v1/croutes/get-by-droutes", {
      body: data,
    }),
};
