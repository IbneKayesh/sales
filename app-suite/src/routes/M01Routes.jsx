import ModulePage from "@/pages/M01/ModulePage";
import DepartmentPage from "@/pages/M01/setup/departments/DepartmentPage";
import SectionPage from "@/pages/M01/setup/sections/SectionPage";

const routes = [
  { path: "/M01/modules", element: <ModulePage /> },
  { path: "/M01/departments", element: <DepartmentPage /> },
  { path: "/M01/sections", element: <SectionPage /> },
];

export default routes;
