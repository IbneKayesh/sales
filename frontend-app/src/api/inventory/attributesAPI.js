import { apiRequest } from "@/utils/api.js";

//attributesAPI
export const attributesAPI = {
  getAllAttribProduct: (data) =>
    apiRequest("/inventory/attributes/product", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAllAttribCategory: (data) =>
    apiRequest("/inventory/attributes/category", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  create: (data) =>
    apiRequest("/inventory/attributes/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (data) =>
    apiRequest("/inventory/attributes/update", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  delete: (data) =>
    apiRequest("/inventory/attributes/delete", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
