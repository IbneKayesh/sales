import React from "react";
import { Route } from "react-router-dom";

const RolePage = React.lazy(() => import("../pages/setup/role/RolePage"));
const UserPage = React.lazy(() => import("../pages/setup/UserPage"));
const UserProfilePage = React.lazy(() => import("../pages/setup/UserProfilePage"));

const setupRoutes = (
  <>
    <Route path="/web/master/role" element={<RolePage />} />
    <Route path="/setup/user" element={<UserPage />} />
    <Route path="/setup/users/profile" element={<UserProfilePage />} />
  </>
);

export default setupRoutes;
