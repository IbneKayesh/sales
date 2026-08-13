import { apiRequest } from "@/utils/api.js";

//filesAPI
export const filesAPI = {
  getBySourceRefId: (data) =>
    apiRequest("/M01/v1/files/get-file", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M01/v1/files/upsert", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M01/v1/files/delete", {
      body: data,
    }),
};
