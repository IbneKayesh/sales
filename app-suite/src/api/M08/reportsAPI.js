import { apiRequest } from "@/utils/api.js";

//reportsAPI
export const reportsAPI = {
  getJournalData: (data) =>
    apiRequest("/M08/v1/reports/get-journal-data", {
      body: data,
    }),
};
