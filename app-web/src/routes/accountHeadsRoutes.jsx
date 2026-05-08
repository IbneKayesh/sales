import React from "react";
import { Route } from "react-router-dom";

const HeadsPage = React.lazy(() => import("../pages/accounts/setup/heads/HeadsPage"));

const accountHeadsRoutes = (
  <>
    <Route path="/accounts/setup/heads" element={<HeadsPage />} />
  </>
);

export default accountHeadsRoutes;
