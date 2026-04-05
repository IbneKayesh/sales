import { apiRequest } from '@/utils/api.js';

//defaultDataAPI
export const defaultDataAPI = {
  getAll: (data) =>
    apiRequest("/setup/default-data", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/setup/default-data/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
