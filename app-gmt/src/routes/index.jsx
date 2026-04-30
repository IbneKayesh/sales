import accountsRoutes from "./accountsRoutes";
import crmRoutes from "./crmRoutes";
import inventoryRoutes from "./inventoryRoutes";
import salesRoutes from "./salesRoutes";
import setupRoutes from "./setupRoutes";

const AppRoutesList = (
  <>
    {accountsRoutes}
    {crmRoutes}
    {inventoryRoutes}
    {salesRoutes}
    {setupRoutes}
  </>
);
export default AppRoutesList;
