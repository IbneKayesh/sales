import { apiRequest } from '@/utils/api.js';

//installationsAPI
export const installationsAPI = {
  getAll: (data) =>
    apiRequest("/setup/installations", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/setup/installations/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
