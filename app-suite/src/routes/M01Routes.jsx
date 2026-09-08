import ModulePage from "@/pages/M01/ModulePage";
import DepartmentPage from "@/pages/M01/setup/departments/DepartmentPage";
import SectionPage from "@/pages/M01/setup/sections/SectionPage";
import GridOptionsPage from "@/pages/M01/GridOptionsPage";
import DataProcessPage from "@/pages/M01/DataProcessPage";
import ThemePage from "@/pages/M01/ThemePage";
import WorkSpacePage from "@/pages/WorkSpacePage";
import FeaturePage from "@/pages/M01/features/FeaturePage";
import UsersPage from "@/pages/M01/users/UsersPage";

const routes = [
  { path: "/bsuite/modules", element: <ModulePage /> },
  { path: "/bsuite/workspace", element: <WorkSpacePage /> },
  { path: "/bsuite/theme", element: <ThemePage /> },
  { path: "/bsuite/features", element: <FeaturePage /> },
  { path: "/settings/grid-options", element: <GridOptionsPage /> },
  { path: "/settings/data-process", element: <DataProcessPage /> },
  { path: "/settings/departments", element: <DepartmentPage /> },
  { path: "/settings/sections", element: <SectionPage /> },
  { path: "/settings/users", element: <UsersPage /> },
];

export default routes;
