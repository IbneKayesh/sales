import BrandPage from "@/pages/M04/setup/brands/BrandPage";
import McatgPage from "@/pages/M04/setup/mcatgs/McatgPage";
import MgrupPage from "@/pages/M04/setup/mgrups/MgrupPage";
import UnitsPage from "@/pages/M04/setup/units/UnitsPage";
import ItemsPage from "@/pages/M04/setup/items/ItemsPage";
import StockPage from "@/pages/M04/stock/StockPage";
import BundlePage from "@/pages/M04/setup/bundle/BundlePage";

const routes = [
  { path: "/inventory/setup/brands", element: <BrandPage /> },
  { path: "/inventory/setup/categories", element: <McatgPage /> },
  { path: "/inventory/setup/groups", element: <MgrupPage /> },
  { path: "/inventory/setup/units", element: <UnitsPage /> },
  { path: "/inventory/setup/items", element: <ItemsPage /> },
  { path: "/inventory/stock", element: <StockPage /> },
  { path: "/inventory/setup/items-price-bundle", element: <BundlePage /> },
];

export default routes;
