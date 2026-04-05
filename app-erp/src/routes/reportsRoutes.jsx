import React from "react";
import { Route } from "react-router-dom";

const DashboardPage = React.lazy(() => import("../pages/reports/shop/DashboardPage.jsx"));

const reportsRoutes = (
  <>
    <Route path="reports/shop/dashboard" element={<DashboardPage />} />
  </>
);

export default reportsRoutes;
