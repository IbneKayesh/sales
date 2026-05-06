import React from "react";
import { Route } from "react-router-dom";

const DashboardPage = React.lazy(() => import("../pages/dashboard/DashboardPage"));

const homeRoutes = (
  <>
    <Route path="/dashboard" element={<DashboardPage />} />
  </>
);

export default homeRoutes;
