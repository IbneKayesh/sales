import { apiRequest } from "@/utils/api.js";

// Purchase Order Child API
export const poChildAPI = {
  getByMasterId: (masterId) => apiRequest(`/po-child/master/${masterId}`),
  getBySupplierId: (supplierId) => apiRequest(`/po-child/booking/${supplierId}`),
  getReturnsByOrderNo: (orderNo) => apiRequest(`/po-child/returns/${orderNo}`),
};
