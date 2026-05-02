import React from "react";
import { Route } from "react-router-dom";

const ProductPage = React.lazy(() => import("../pages/inventory/setup/products/ProductPage"));
const UnitPage = React.lazy(() => import("../pages/inventory/setup/units/UnitPage"));
const ItransferPage = React.lazy(() => import("../pages/inventory/itransfer/ItransferPage"));

const inventoryRoutes = (
  <>
    <Route path="/inventory/setup/products" element={<ProductPage />} />
    <Route path="/inventory/setup/units" element={<UnitPage />} />
    <Route path="/inventory/itransfer" element={<ItransferPage />} />
  </>
);

export default inventoryRoutes;
