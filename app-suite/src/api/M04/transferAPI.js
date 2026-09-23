import { apiRequest } from "@/utils/api.js";

//transferAPI
export const transferAPI = {
  getAll: (data) =>
    apiRequest("/M04/v1/transferIO", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M04/v1/transferIO/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M04/v1/transferIO/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M04/v1/transferIO/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M04/v1/transferIO/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M04/v1/transferIO/get-all-active", {
      body: data,
    }),
  getDetailsByMasterId: (data) =>
    apiRequest("/M04/v1/transferIO/get-details-by-master", {
      body: data,
    }),
};
