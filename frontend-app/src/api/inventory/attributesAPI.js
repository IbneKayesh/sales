import { apiRequest } from '@/utils/api.js';

//attributesAPI
export const attributesAPI = {
  getAll: (data) =>
    apiRequest("/inventory/attributes", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};