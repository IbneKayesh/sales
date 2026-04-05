import { apiRequest } from "@/utils/api.js";

//databaseAPI
export const databaseAPI = {
  getAll: (data) =>
    apiRequest("/setup/database/get-backup", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/setup/database/create-backup", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/setup/database/delete-backup", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  download: async (name) => {
    const token = localStorage.getItem("sgd25");
    const response = await fetch(
      `/api/setup/database/download-backup/${name}`,
      {
        method: "GET",
        headers: {
          "app-api-key": import.meta.env.VITE_APP_API_KEY,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      },
    );
    if (!response.ok) throw new Error("Download failed");
    return await response.blob();
  },
};
