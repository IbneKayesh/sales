import { apiRequest } from "@/utils/api.js";

//departmentsAPI
export const departmentsAPI = {
  getAllActive: (data) =>
    apiRequest("/settings/v1/departments/get-all-active", { body: data }),
};
