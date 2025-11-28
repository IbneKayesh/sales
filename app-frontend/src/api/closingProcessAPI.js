import { apiRequest } from "@/utils/api.js";

// Closing Process API
export const closingProcessAPI = {
  updateItem: (id) =>
    apiRequest("/closing-process/update-item", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
  updatePurchase: (id) =>
    apiRequest("/closing-process/update-purchase", {
      method: "POST",
      body: JSON.stringify({ id }),
    }),
};
