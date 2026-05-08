import homeRoutes from "./homeRoutes";
import authRoutes from "./authRoutes";
import crmRoutes from "./crmRoutes";
import inventoryRoutes from "./inventoryRoutes";
import settingsRoutes from "./settingsRoutes";
import accountHeadsRoutes from "./accountHeadsRoutes";

const AppRoutesList = (
  <>
    {homeRoutes}
    {authRoutes}
    {crmRoutes}
    {inventoryRoutes}
    {settingsRoutes}
    {accountHeadsRoutes}
  </>
);
export default AppRoutesList;
