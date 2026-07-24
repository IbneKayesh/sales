import ContactPage from "@/pages/M06/setup/contacts/ContactPage";
import DistrictZonePage from "@/pages/M06/setup/districtzone/DistrictZonePage";
import ThanaAreaPage from "@/pages/M06/setup/thanaarea/ThanaAreaPage";
import TerritoryPage from "@/pages/M06/setup/territories/TerritoryPage";

const routes = [
  { path: "/M06/contacts", element: <ContactPage /> },
  { path: "/crm/setup/district-zones", element: <DistrictZonePage /> },
  { path: "/crm/setup/thana-areas", element: <ThanaAreaPage /> },
  { path: "/crm/setup/territories", element: <TerritoryPage /> },
];

export default routes;
