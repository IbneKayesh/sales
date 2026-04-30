import React from "react";
import { Route } from "react-router-dom";

const SupplierPage = React.lazy(() => import("../pages/crm/suppliers/SupplierPage"));

const crmRoutes = (
  <>
    <Route path="/dealer/supplier" element={<SupplierPage />} />
  </>
);

export default crmRoutes;
