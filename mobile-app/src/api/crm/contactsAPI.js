import { apiRequest } from "@/utils/api.js";

//contactsAPI
export const contactsAPI = {
  getAll: (data) =>
    apiRequest("/mobile/crm/contacts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};