import { apiRequest } from "@/utils/api.js";

//reportsAPI
export const reportsAPI = {
  getJournalData: (data) =>
    apiRequest("/M08/v1/reports/get-journal-data", {
      body: data,
    }),
  getContactsLedger: (data) =>
    apiRequest("/M08/v1/reports/get-contacts-ledger", {
      body: data,
    }),
  getPartyLedger: (data) =>
    apiRequest("/M08/v1/reports/get-party-ledger", {
      body: data,
    }),
};
