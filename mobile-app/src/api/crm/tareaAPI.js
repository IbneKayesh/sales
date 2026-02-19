import { apiRequest } from "@/utils/api.js";

//tarea API
export const tareaAPI = {
  getByZone: (data) =>
    apiRequest("/crm/tarea/get-by-dzone", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
