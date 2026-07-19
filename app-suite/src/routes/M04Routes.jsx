import BrandPage from "@/pages/M04/setup/brands/BrandPage";
import McatgPage from "@/pages/M04/setup/mcatgs/McatgPage";
import MgrupPage from "@/pages/M04/setup/mgrups/MgrupPage";
import AttrbPage from "@/pages/M04/setup/attrbs/AttrbPage";
import ScatgPage from "@/pages/M04/setup/scatgs/ScatgPage";
import SgrupPage from "@/pages/M04/setup/sgrups/SgrupPage";
import UnitsPage from "@/pages/M04/setup/unitses/UnitsPage";

const routes = [
  { path: "/inventory/setup/brands", element: <BrandPage /> },
  { path: "/M04/main-categories", element: <McatgPage /> },
  { path: "/M04/main-groups", element: <MgrupPage /> },
  { path: "/M04/attributes", element: <AttrbPage /> },
  { path: "/M04/sub-categories", element: <ScatgPage /> },
  { path: "/M04/sub-groups", element: <SgrupPage /> },
  { path: "/M04/units", element: <UnitsPage /> },
];

export default routes;
