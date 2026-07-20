import { apiRequest } from "@/utils/api.js";

//groupsAPI
export const groupsAPI = {
  getAll: (data) =>
    apiRequest("/M04/v1/groups", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M04/v1/groups/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M04/v1/groups/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M04/v1/groups/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M04/v1/groups/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M04/v1/groups/get-all-active", {
      body: data,
    }),
};
