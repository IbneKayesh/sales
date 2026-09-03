import { apiRequest } from "@/utils/api.js";

//adjustmentsAPI
export const adjustmentsAPI = {
  getAll: (data) =>
    apiRequest("/M04/v1/adjustments", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M04/v1/adjustments/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M04/v1/adjustments/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M04/v1/adjustments/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M04/v1/adjustments/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M04/v1/adjustments/get-all-active", {
      body: data,
    }),
  getDetailsByMasterId: (data) =>
    apiRequest("/M04/v1/adjustments/get-details-by-master", {
      body: data,
    }),
};
