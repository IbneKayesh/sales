import { apiRequest } from "@/utils/api.js";

//subGroupsAPI
export const subGroupsAPI = {
  getAll: (data) =>
    apiRequest("/M04/v1/sub-groups", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M04/v1/sub-groups/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M04/v1/sub-groups/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M04/v1/sub-groups/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M04/v1/sub-groups/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M04/v1/sub-groups/get-all-active", {
      body: data,
    }),
};
