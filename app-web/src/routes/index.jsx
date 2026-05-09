import homeRoutes from "./homeRoutes";
import authRoutes from "./authRoutes";
import crmRoutes from "./crmRoutes";
import inventoryRoutes from "./inventoryRoutes";
import settingsRoutes from "./settingsRoutes";
import accountsRoutes from "./accountsRoutes";

const AppRoutesList = (
  <>
    {homeRoutes}
    {authRoutes}
    {crmRoutes}
    {inventoryRoutes}
    {settingsRoutes}
    {accountsRoutes}
  </>
);
export default AppRoutesList;
