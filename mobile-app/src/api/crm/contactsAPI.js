import { apiRequest } from "@/utils/api.js";

//contactsAPI
export const contactsAPI = {
  getAll: (data) =>
    apiRequest("/mobile/crm/contacts", {
      method: "POST",
      body: JSON.stringify(data),
    }),
    create: (data) =>
      apiRequest("/mobile/crm/contacts/create", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (data) =>
      apiRequest("/mobile/crm/contacts/update", {
        method: "POST",
        body: JSON.stringify(data),
      }),
};