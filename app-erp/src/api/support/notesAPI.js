import { apiRequest } from "@/utils/api.js";

// Notes API
export const notesAPI = {
  getAll: (data) =>
    apiRequest("/support/notes", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/support/notes/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/support/notes/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/support/notes/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
