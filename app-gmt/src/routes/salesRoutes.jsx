import React from "react";
import { Route } from "react-router-dom";
import PosPage from "../pages/sales/pos/PosPage";
import InvoicePage from "../pages/sales/invoice/InvoicePage";

const salesRoutes = (
  <>
    <Route path="/sales-pos" element={<PosPage />} />
    <Route path="/dealer/invoice-list" element={<InvoicePage />} />
  </>
);

export default salesRoutes;
