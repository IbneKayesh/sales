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
  purchaseInvoice: (data) =>
    apiRequest("/inventory/stockreports/purchase-invoice", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  inventoryTransfer: (data) =>
    apiRequest("/inventory/stockreports/inventory-transfer", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};