import { apiRequest } from "@/utils/api.js";

// Purchase Order Child API
export const poChildAPI = {
  //getAll: () => apiRequest('/po-child'),
  getByMasterId: (masterId) => apiRequest(`/po-child/master/${masterId}`),
  getBySupplierId: (supplierId) => apiRequest(`/po-child/booking/${supplierId}`),
  getReturnsByOrderNo: (orderNo) => apiRequest(`/po-child/returns/${orderNo}`),
  
  // getById: (id) => apiRequest(`/po-child/${id}`),
  // create: (poChild) => apiRequest('/po-child', {
  //   method: 'POST',
  //   body: JSON.stringify(poChild),
  // }),
  // update: (id, poChild) => apiRequest('/po-child/update', {
  //   method: 'POST',
  //   body: JSON.stringify({ id, ...poChild }),
  // }),
  // delete: (id) => apiRequest('/po-child/delete', {
  //   method: 'POST',
  //   body: JSON.stringify({ id }),
  // }),
};
