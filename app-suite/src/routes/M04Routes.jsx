import BrandPage from "@/pages/M04/setup/brands/BrandPage";
import McatgPage from "@/pages/M04/setup/mcatgs/McatgPage";
import MgrupPage from "@/pages/M04/setup/mgrups/MgrupPage";
import UnitsPage from "@/pages/M04/setup/units/UnitsPage";
import ItemsPage from "@/pages/M04/setup/items/ItemsPage";

const routes = [
  { path: "/inventory/setup/brands", element: <BrandPage /> },
  { path: "/inventory/setup/categories", element: <McatgPage /> },
  { path: "/inventory/setup/groups", element: <MgrupPage /> },
  { path: "/inventory/setup/units", element: <UnitsPage /> },
  { path: "/inventory/setup/items", element: <ItemsPage /> },
];

export default routes;
