import { apiRequest } from "@/utils/api";

export const teachAPI = {
  getAll: (data) =>
    apiRequest("/M09/v1/teach", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M09/v1/teach/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M09/v1/teach/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M09/v1/teach/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M09/v1/teach/delete", {
      body: data,
    }),
};
