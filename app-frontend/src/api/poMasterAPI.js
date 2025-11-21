import { apiRequest } from "@/utils/api.js";

// Purchase Order Master API
export const poMasterAPI = {
  getAll: (orderType, filter = "default") =>
    apiRequest(`/po-master?orderType=${orderType}&filter=${filter}`),
  getById: (id) => apiRequest(`/po-master/${id}`),
  create: (po) =>
    apiRequest("/po-master", {
      method: "POST",
      body: JSON.stringify(po),
    }),
  update: (id, po) =>
    apiRequest("/po-master/update", {
      method: "POST",
      body: JSON.stringify({ id, ...po }),
    }),
  delete: (id) =>
    apiRequest("/po-master/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
};
