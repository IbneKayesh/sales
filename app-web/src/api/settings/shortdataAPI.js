import { apiRequest } from "@/utils/api.js";

//shortdataAPI
export const shortdataAPI = {
  getCountry: () =>
    apiRequest("/settings/v1/short-data", {
      body: { shtbl_gname: "Country" },
    }),
  getCurrency: () =>
    apiRequest("/settings/v1/short-data", {
      body: { shtbl_gname: "Currency" },
    }),
};
