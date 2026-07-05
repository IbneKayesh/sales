import React from "react";
import { Route } from "react-router-dom";

const DashboardPage = React.lazy(() => import("../pages/dashboard/DashboardPage"));
const NotificationsPage = React.lazy(() => import("../pages/layout/NotificationsPage"));

const homeRoutes = (
  <>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/notifications" element={<NotificationsPage />} />
  </>
);

export default homeRoutes;
