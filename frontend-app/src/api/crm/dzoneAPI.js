import { apiRequest } from "@/utils/api.js";

//dzone API
export const dzoneAPI = {
  getByCountry: (data) =>
    apiRequest("/crm/dzone/get-by-country", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
