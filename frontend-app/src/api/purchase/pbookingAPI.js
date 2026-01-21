import { apiRequest } from "@/utils/api.js";

//Users API
export const pbookingAPI = {
  getAll: (data) =>
    apiRequest("/purchase/pbooking", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/purchase/pbooking/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/purchase/pbooking/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/purchase/pbooking/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getDetails: (data) =>
    apiRequest("/purchase/pbooking/booking-details", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getExpenses: (data) =>
    apiRequest("/purchase/pbooking/booking-expense", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getPayment: (data) =>
    apiRequest("/purchase/pbooking/booking-payment", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  cancelBookingItems: (data) =>
    apiRequest("/purchase/pbooking/cancel-booking-items", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
