import { apiRequest } from "@/utils/api.js";

//outletRouteAPI
export const outletRouteAPI = {
  getByOutlet: (data) =>
    apiRequest("/mobile/crm/outlet-route/get-by-outlet", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};