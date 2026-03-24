import React from "react";
import { Route } from "react-router-dom";

const DatabasePage = React.lazy(() => import("../pages/setup/database/DatabasePage.jsx"));
const BusinessPage = React.lazy(() => import("../pages/setup/business/BusinessPage.jsx"));
const UsersPage = React.lazy(() => import("../pages/setup/users/UsersPage.jsx"));
const ProfileSettings = React.lazy(() => import("../pages/setup/users/ProfileSettings.jsx"));
const DefaultDataPage = React.lazy(() => import("../pages/setup/settings/DefaultDataPage.jsx"));
const InstallationsPage = React.lazy(() => import("../pages/setup/installations/InstallationsPage.jsx"));


const setupRoutes = (
  <>
    <Route path="setup/database" element={<DatabasePage />} />
    <Route path="setup/business" element={<BusinessPage />} />
    <Route path="setup/users" element={<UsersPage />} />
    <Route path="setup/users/profile" element={<ProfileSettings />} />
    <Route path="setup/default-data" element={<DefaultDataPage />} />
    <Route path="setup/installations" element={<InstallationsPage />} />
  </>
);

export default setupRoutes;
