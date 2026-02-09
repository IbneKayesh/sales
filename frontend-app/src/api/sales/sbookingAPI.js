import { apiRequest } from "@/utils/api.js";

//sbookingAPI
export const sbookingAPI = {
  getAll: (data) =>
    apiRequest("/sales/sbooking", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/sales/sbooking/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/sales/sbooking/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/sales/sbooking/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getDetails: (data) =>
    apiRequest("/sales/sbooking/booking-details", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getExpenses: (data) =>
    apiRequest("/sales/sbooking/booking-expense", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getPayment: (data) =>
    apiRequest("/sales/sbooking/booking-payment", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  cancelBookingItems: (data) =>
    apiRequest("/sales/sbooking/cancel-booking-items", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
