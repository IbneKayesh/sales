import { apiRequest } from "@/utils/api";

export const brandsAPI = {
  getAll: (data: any) =>
    apiRequest("/inventory/brands", {
      method: "POST",
      body: data,
    }),
  create: (data: any) =>
    apiRequest("/inventory/brands/create", {
      method: "POST",
      body: data,
    }),
  update: (data: any) =>
    apiRequest("/inventory/brands/update", {
      method: "POST",
      body: data,
    }),
  delete: (data: any) =>
    apiRequest("/inventory/brands/delete", {
      method: "POST",
      body: data,
    }),
  getAllActive: (data: any) =>
    apiRequest("/inventory/brands/get-all-active", {
      method: "POST",
      body: data,
    }),
};
