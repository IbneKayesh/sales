import { apiRequest } from "@/utils/api.js";

//dashboardAPI — Home page dashboard (app-level, not module-scoped)
export const dashboardAPI = {
  getSummary: (data) =>
    apiRequest("/dashboard/v1/summary", {
      body: data,
    }),
  getChartData: (data) =>
    apiRequest("/dashboard/v1/chart-data", {
      body: data,
    }),
  getRecentTransactions: (data) =>
    apiRequest("/dashboard/v1/recent-transactions", {
      body: data,
    }),
};