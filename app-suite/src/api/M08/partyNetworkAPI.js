import { apiRequest } from "@/utils/api.js";

//partyNetworkAPI
export const partyNetworkAPI = {
  getAll: (data) =>
    apiRequest("/M08/v1/party-network", {
      body: data,
    }),
};
