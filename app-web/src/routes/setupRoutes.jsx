import React from "react";
import { Route } from "react-router-dom";

const UserProfilePage = React.lazy(() => import("../pages/auth/UserProfilePage"));

const setupRoutes = (
  <>
    <Route path="/auth/profile" element={<UserProfilePage />} />
  </>
);

export default setupRoutes;
