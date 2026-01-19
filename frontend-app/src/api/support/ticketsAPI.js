import { apiRequest } from "@/utils/api.js";

// Tickets API
export const ticketsAPI = {
  getAll: (data) =>
    apiRequest("/support/tickets", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/support/tickets/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/support/tickets/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/support/tickets/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
