import { apiRequest } from "@/utils/api.js";

//partyAutoAPI
export const partyAutoAPI = {
  getAll: (data) =>
    apiRequest("/M08/v1/party-auto", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M08/v1/party-auto/update", {
      body: data,
    }),
};
