import { apiRequest } from "@/utils/api.js";

//processAPI
export const processAPI = {
  getAll: (data) =>
    apiRequest("/M05/v1/process", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M05/v1/process/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M05/v1/process/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M05/v1/process/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M05/v1/process/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M05/v1/process/get-all-active", {
      body: data,
    }),
  getRMPMbyProcessId: (data) =>
    apiRequest("/M05/v1/process/get-rmpm-by-process", {
      body: data,
    }),
  getFOHbyProcessId: (data) =>
    apiRequest("/M05/v1/process/get-foh-by-process", {
      body: data,
    }),
  getSFGFGbyProcessId: (data) =>
    apiRequest("/M05/v1/process/get-sfg-by-process", {
      body: data,
    }),
  getBatchbyProcessId: (data) =>
    apiRequest("/M05/v1/process/get-batch-by-process", {
      body: data,
    }),
};
