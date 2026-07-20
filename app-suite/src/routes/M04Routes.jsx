import BrandPage from "@/pages/M04/setup/brands/BrandPage";
import McatgPage from "@/pages/M04/setup/mcatgs/McatgPage";
import MgrupPage from "@/pages/M04/setup/mgrups/MgrupPage";
import AttrbPage from "@/pages/M04/setup/attrbs/AttrbPage";
import UnitsPage from "@/pages/M04/setup/units/UnitsPage";

const routes = [
  { path: "/inventory/setup/brands", element: <BrandPage /> },
  { path: "/inventory/setup/categories", element: <McatgPage /> },
  { path: "/inventory/setup/groups", element: <MgrupPage /> },
  { path: "/M04/attributes", element: <AttrbPage /> },
  { path: "/inventory/setup/units", element: <UnitsPage /> },
];

export default routes;
