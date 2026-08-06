import ModulePage from "@/pages/M01/ModulePage";
import DepartmentPage from "@/pages/M01/setup/departments/DepartmentPage";
import SectionPage from "@/pages/M01/setup/sections/SectionPage";

const routes = [
  { path: "/bsuite/modules", element: <ModulePage /> },
  { path: "/settings/departments", element: <DepartmentPage /> },
  { path: "/settings/sections", element: <SectionPage /> },
];

export default routes;
