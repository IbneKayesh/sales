import React from "react";
import { Route } from "react-router-dom";

const UnitPage = React.lazy(() => import("../pages/inventory/units/UnitPage"));
const BrandPage = React.lazy(() => import("../pages/inventory/brands/BrandPage"));
const CategoryPage = React.lazy(() => import("../pages/inventory/category/CategoryPage"));
const ProductsPage = React.lazy(() => import("../pages/inventory/products/ProductsPage"));
const StockReportsPage = React.lazy(() => import("../pages/inventory/stockreports/StockReportsPage"));
const TransferPage = React.lazy(() => import("../pages/inventory/itransfer/TransferPage"));

const inventoryRoutes = (
  <>
    <Route path="inventory/units" element={<UnitPage />} />
    <Route path="inventory/brands" element={<BrandPage />} />
    <Route path="inventory/category" element={<CategoryPage />} />
    <Route path="inventory/products" element={<ProductsPage />} />
    <Route path="inventory/stockreports" element={<StockReportsPage />} />
    <Route path="inventory/itransfer" element={<TransferPage />} />
  </>
);

export default inventoryRoutes;
