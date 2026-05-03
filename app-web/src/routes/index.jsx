import authRoutes from "./authRoutes";
import crmRoutes from "./crmRoutes";
import inventoryRoutes from "./inventoryRoutes";
import settingsRoutes from "./settingsRoutes";

const AppRoutesList = (
    <>
        {authRoutes}
        {crmRoutes}
        {inventoryRoutes}
        {settingsRoutes}
    </>
);
export default AppRoutesList;
