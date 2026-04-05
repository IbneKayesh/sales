import React from "react";
import { Route } from "react-router-dom";

const HomePage = React.lazy(() => import("../pages/HomePage.jsx"));
const ModulePage = React.lazy(() => import("../pages/ModulePage.jsx"));

const coreRoutes = (
  <>
    <Route index element={<HomePage />} />
    <Route path="module" element={<ModulePage />} />
  </>
);

export default coreRoutes;
