import { apiRequest } from "@/utils/api";

export const examAPI = {
  getAll: (data) =>
    apiRequest("/M49/v1/exams", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M49/v1/exams/get-all-active", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M49/v1/exams/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M49/v1/exams/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M49/v1/exams/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M49/v1/exams/delete", {
      body: data,
    }),
};
