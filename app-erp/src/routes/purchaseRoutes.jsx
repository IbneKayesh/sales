import React from "react";
import { Route } from "react-router-dom";

const BookingPage = React.lazy(() => import("../pages/purchase/pbooking/BookingPage"));
const ReceiptPage = React.lazy(() => import("../pages/purchase/preceipt/ReceiptPage"));
const InvoicePage = React.lazy(() => import("../pages/purchase/pinvoice/InvoicePage"));

const purchaseRoutes = (
  <>
    <Route path="purchase/pbooking" element={<BookingPage />} />
    <Route path="purchase/preceipt" element={<ReceiptPage />} />
    <Route path="purchase/pinvoice" element={<InvoicePage />} />
  </>
);

export default purchaseRoutes;
