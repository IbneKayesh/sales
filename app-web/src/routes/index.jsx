import authRoutes from "./authRoutes";
import crmRoutes from "./crmRoutes";
import inventoryRoutes from "./inventoryRoutes";

const AppRoutesList = (
    <>
        {authRoutes}
        {crmRoutes}
        {inventoryRoutes}
    </>
);
export default AppRoutesList;
