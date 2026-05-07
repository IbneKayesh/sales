import React from "react";
import { Route } from "react-router-dom";

const BrandsPage = React.lazy(() => import("../pages/inventory/setup/brands/BrandsPage"));
const UnitsPage = React.lazy(() => import("../pages/inventory/setup/units/UnitsPage"));
const CategoryPage = React.lazy(() => import("../pages/inventory/setup/category/CategoryPage"));
const SubCategoryPage = React.lazy(() => import("../pages/inventory/setup/subcategory/SubCategoryPage"));
const AttributesPage = React.lazy(() => import("../pages/inventory/setup/attributes/AttributesPage"));
const GroupPage = React.lazy(() => import("../pages/inventory/setup/group/GroupPage"));
const SubGroupPage = React.lazy(() => import("../pages/inventory/setup/subgroup/SubGroupPage"));

const inventoryRoutes = (
  <>
    <Route path="/inventory/setup/brands" element={<BrandsPage />} />
    <Route path="/inventory/setup/units" element={<UnitsPage />} />
    <Route path="/inventory/setup/category" element={<CategoryPage />} />
    <Route path="/inventory/setup/sub-category" element={<SubCategoryPage />} />
    <Route path="/inventory/setup/attributes" element={<AttributesPage />} />
    <Route path="/inventory/setup/group" element={<GroupPage />} />
    <Route path="/inventory/setup/sub-group" element={<SubGroupPage />} />
  </>
);

export default inventoryRoutes;
