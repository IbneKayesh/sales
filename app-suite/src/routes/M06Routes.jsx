import ContactPage from "@/pages/M06/setup/contacts/ContactPage";
import DistrictZonePage from "@/pages/M06/setup/districtzone/DistrictZonePage";
import ThanaAreaPage from "@/pages/M06/setup/thanaarea/ThanaAreaPage";
import TerritoryPage from "@/pages/M06/setup/territories/TerritoryPage";
import DRoutePage from "@/pages/M06/ff/droute/DRoutePage";

const routes = [
  { path: "/crm/contacts", element: <ContactPage /> },
  { path: "/crm/setup/district-zones", element: <DistrictZonePage /> },
  { path: "/crm/setup/thana-areas", element: <ThanaAreaPage /> },
  { path: "/crm/setup/territories", element: <TerritoryPage /> },
  { path: "/crm/ff/delivery-routes", element: <DRoutePage /> },
];

export default routes;
