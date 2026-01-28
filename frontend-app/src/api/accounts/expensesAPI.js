import { apiRequest } from "@/utils/api.js";

//expensesAPI
export const expensesAPI = {
  getAll: (data) =>
    apiRequest("/accounts/expenses", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
