import homeRoutes from "./homeRoutes";
import authRoutes from "./authRoutes";
import crmRoutes from "./crmRoutes";
import inventoryRoutes from "./inventoryRoutes";
import settingsRoutes from "./settingsRoutes";

const AppRoutesList = (
  <>
    {homeRoutes}
    {authRoutes}
    {crmRoutes}
    {inventoryRoutes}
    {settingsRoutes}
  </>
);
export default AppRoutesList;
