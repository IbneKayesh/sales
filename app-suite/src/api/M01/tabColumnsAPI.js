import { apiRequest } from "@/utils/api.js";

//tabColumnsAPI
export const tabColumnsAPI = {
  update: (data) =>
    apiRequest("/M01/v1/tab-columns/update", {
      body: data,
    }),
  getByPage: (data) =>
    apiRequest("/M01/v1/tab-columns/get-by-page", {
      body: data,
    }),
  getByTable: (data) =>
    apiRequest("/M01/v1/tab-columns/get-by-table", {
      body: data,
    }),
};
