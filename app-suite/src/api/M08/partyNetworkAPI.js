import { apiRequest } from "@/utils/api.js";

//partyNetworkAPI
export const partyNetworkAPI = {
  getAll: (data) =>
    apiRequest("/M08/v1/party-network", {
      body: data,
    }),
  getSalesInvoice: (data) =>
    apiRequest("/M08/v1/party-network/sales-invoice", {
      body: data,
    }),
  getMrrDirect: (data) =>
    apiRequest("/M08/v1/party-network/mrr-direct", {
      body: data,
    }),
};
