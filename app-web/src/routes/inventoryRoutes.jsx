import React from "react";
import { Route } from "react-router-dom";

const BrandsPage = React.lazy(() => import("../pages/inventory/setup/brands/BrandsPage"));
const UnitsPage = React.lazy(() => import("../pages/inventory/setup/units/UnitsPage"));
const CategoryPage = React.lazy(() => import("../pages/inventory/setup/category/CategoryPage"));
const ItransferPage = React.lazy(() => import("../pages/inventory/itransfer/ItransferPage"));

const inventoryRoutes = (
  <>
    <Route path="/inventory/setup/brands" element={<BrandsPage />} />
    <Route path="/inventory/setup/units" element={<UnitsPage />} />
    <Route path="/inventory/setup/category" element={<CategoryPage />} />
  </>
);

export default inventoryRoutes;
