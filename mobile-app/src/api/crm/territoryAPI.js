import { apiRequest } from "@/utils/api.js";

//territoryAPI
export const territoryAPI = {
  getAll: (data) =>
    apiRequest("/crm/territory", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
