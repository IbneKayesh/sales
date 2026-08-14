import ModulePage from "@/pages/M01/ModulePage";
import DepartmentPage from "@/pages/M01/setup/departments/DepartmentPage";
import SectionPage from "@/pages/M01/setup/sections/SectionPage";
import GridOptionsPage from "@/pages/M01/GridOptionsPage";
import GeneralPage from "@/pages/M01/GeneralPage";
import BlankPage from "@/pages/BlankPage";

const routes = [
  { path: "/bsuite/modules", element: <ModulePage /> },
  { path: "/bsuite/blank", element: <BlankPage /> },
  { path: "/settings/grid-options", element: <GridOptionsPage /> },
  { path: "/settings/departments", element: <DepartmentPage /> },
  { path: "/settings/sections", element: <SectionPage /> },
  { path: "/settings/general", element: <GeneralPage /> },
];

export default routes;
