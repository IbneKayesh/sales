import ModulePage from "@/pages/M01/ModulePage";
import DepartmentPage from "@/pages/M01/setup/departments/DepartmentPage";
import SectionPage from "@/pages/M01/setup/sections/SectionPage";
import GridOptionsPage from "@/pages/M01/GridOptionsPage";
import ThemePage from "@/pages/M01/ThemePage";
import WorkSpacePage from "@/pages/WorkSpacePage";
import FeaturePage from "@/pages/M01/features/FeaturePage";

const routes = [
  { path: "/bsuite/modules", element: <ModulePage /> },
  { path: "/bsuite/workspace", element: <WorkSpacePage /> },
  { path: "/bsuite/theme", element: <ThemePage /> },
  { path: "/settings/grid-options", element: <GridOptionsPage /> },
  { path: "/settings/departments", element: <DepartmentPage /> },
  { path: "/settings/sections", element: <SectionPage /> },
  { path: "/bsuite/features", element: <FeaturePage /> },
];

export default routes;
