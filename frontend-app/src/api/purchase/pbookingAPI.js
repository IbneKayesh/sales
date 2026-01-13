import { apiRequest } from "@/utils/api.js";

//Users API
export const pbookingAPI = {
  getAll: (data) =>
    apiRequest("/purchase/pbooking", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (user) =>
    apiRequest("/purchase/pbooking/create", {
      method: "POST",
      body: JSON.stringify(user),
    }),
  update: (user) =>
    apiRequest("/purchase/pbooking/update", {
      method: "POST",
      body: JSON.stringify(user),
    }),
  delete: (user) =>
    apiRequest("/purchase/pbooking/delete", {
      method: "POST",
      body: JSON.stringify(user),
    }),
};
