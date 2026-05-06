import React from "react";
import { Route } from "react-router-dom";

const BrandsPage = React.lazy(() => import("../pages/inventory/setup/brands/BrandsPage"));
const UnitsPage = React.lazy(() => import("../pages/inventory/setup/units/UnitsPage"));
const ItransferPage = React.lazy(() => import("../pages/inventory/itransfer/ItransferPage"));

const inventoryRoutes = (
  <>
    <Route path="/inventory/setup/brands" element={<BrandsPage />} />
    <Route path="/inventory/setup/units" element={<UnitsPage />} />
    <Route path="/inventory/itransfer" element={<ItransferPage />} />
  </>
);

export default inventoryRoutes;
