import React from "react";
import { Route } from "react-router-dom";
import UnitPage from "../pages/inventory/units/UnitPage";
import SubCategoryPage from "../pages/inventory/subcategory/SubCategoryPage";
import CategoryPage from "../pages/inventory/category/CategoryPage";
import ProductsPage from "../pages/inventory/products/ProductsPage";

const inventoryRoutes = (
  <>
    <Route path="/product/unit" element={<UnitPage />} />
    <Route path="/product/sub-category" element={<SubCategoryPage />} />
    <Route path="/product/category" element={<CategoryPage />} />
    <Route path="/product/sku" element={<ProductsPage />} />
  </>
);

export default inventoryRoutes;
