import React from "react";
import { Route } from "react-router-dom";

const SInvoicePage = React.lazy(() => import("../pages/sales/sinvoice/SInvoicePage"));
const SBookingPage = React.lazy(() => import("../pages/sales/sbooking/SBookingPage"));
const SReceiptPage = React.lazy(() => import("../pages/sales/sreceipt/SReceiptPage"));

const salesRoutes = (
  <>
    <Route path="sales/sinvoice" element={<SInvoicePage />} />
    <Route path="sales/sbooking" element={<SBookingPage />} />
    <Route path="sales/sreceipt" element={<SReceiptPage />} />
  </>
);

export default salesRoutes;
