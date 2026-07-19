import React from "react";
import { Route } from "react-router-dom";

const UsersPage = React.lazy(() => import("../pages/settings/users/UsersPage"));

const settingsRoutes = (
  <>
    <Route path="/settings/users" element={<UsersPage />} />
  </>
);

export default settingsRoutes;
