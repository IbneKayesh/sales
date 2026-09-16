import { apiRequest } from "@/utils/api.js";

//deliveryTripAPI
export const deliveryTripAPI = {
  getAll: (data) =>
    apiRequest("/M02/v1/delivery-trip", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M02/v1/delivery-trip/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M02/v1/delivery-trip/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M02/v1/delivery-trip/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M02/v1/delivery-trip/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M02/v1/delivery-trip/get-all-active", {
      body: data,
    }),
  getDetailsByMasterId: (data) =>
    apiRequest("/M02/v1/delivery-trip/get-details-by-master", {
      body: data,
    }),
  getAllDueTrip: (data) =>
    apiRequest("/M02/v1/delivery-trip/get-all-due-trip", {
      body: data,
    }),
};
