import ContactPage from "@/pages/M06/setup/contacts/ContactPage";
import DeliveryZonePage from "@/pages/M06/setup/deliveryzones/DeliveryZonePage";
import TerritoryAreaPage from "@/pages/M06/setup/territoryareas/TerritoryAreaPage";
import TerritoryPage from "@/pages/M06/setup/territories/TerritoryPage";

const routes = [
  { path: "/M06/contacts", element: <ContactPage /> },
  { path: "/M06/delivery-zones", element: <DeliveryZonePage /> },
  { path: "/M06/territory-areas", element: <TerritoryAreaPage /> },
  { path: "/M06/territories", element: <TerritoryPage /> },
];

export default routes;
