import { apiRequest } from "@/utils/api.js";

//journalAPI
export const journalAPI = {
  getAll: (data) =>
    apiRequest("/M08/v1/journal", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M08/v1/journal/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M08/v1/journal/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M08/v1/journal/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M08/v1/journal/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M08/v1/journal/get-all-active", {
      body: data,
    }),
  getChild: (data) =>
    apiRequest("/M08/v1/journal/get-child", {
      body: data,
    }),
};
