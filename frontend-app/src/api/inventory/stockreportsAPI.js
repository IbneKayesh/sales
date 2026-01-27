import { apiRequest } from '@/utils/api.js';

//stockreportsAPI
export const stockreportsAPI = {
  purchaseBooking: (data) =>
    apiRequest("/inventory/stockreports/purchase-booking", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  purchaseReceipt: (data) =>
    apiRequest("/inventory/stockreports/purchase-receipt", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};