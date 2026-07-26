import { apiRequest } from "@/utils/api.js";

//partyAPI
export const partyAPI = {
  getAll: (data) =>
    apiRequest("/M08/v1/parties", {
      body: data,
    }),
  upsert: (data) =>
    apiRequest("/M08/v1/parties/upsert", {
      body: data,
    }),
  create: (data) =>
    apiRequest("/M08/v1/parties/create", {
      body: data,
    }),
  update: (data) =>
    apiRequest("/M08/v1/parties/update", {
      body: data,
    }),
  delete: (data) =>
    apiRequest("/M08/v1/parties/delete", {
      body: data,
    }),
  getAllActive: (data) =>
    apiRequest("/M08/v1/parties/get-all-active", {
      body: data,
    }),
  getByCoa: (data) =>
    apiRequest("/M08/v1/parties/get-by-coa", {
      body: data,
    }),
  getByVendorId: (data) =>
    apiRequest("/M08/v1/parties/get-by-vendor", {
      body: data,
    }),
  createExt: (data) =>
    apiRequest("/M08/v1/parties/create-ext", {
      body: data,
    }),
  getVendorExt: (data) =>
    apiRequest("/M08/v1/parties/get-vendor-ext", {
      body: data,
    }),
};
