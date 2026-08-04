import COAPage from "@/pages/M08/setup/coa/COAPage";
import AccPeriodPage from "@/pages/M08/setup/accountingperiods/AccPeriodPage";
import FiscalYearPage from "@/pages/M08/setup/fiscalyears/FiscalYearPage";
import PartyPage from "@/pages/M08/setup/parties/PartyPage";
import PartyNetworkPage from "@/pages/M08/setup/partynetwork/PartyNetworkPage";
import JournalPage from "@/pages/M08/journals/JournalPage";
import Fstatements from "@/pages/M08/reports/Fstatements";
import Fstatements_bk from "@/pages/M08/reports/Fstatements_bk";

const routes = [
  { path: "/accounts/setup/chart-of-accounts", element: <COAPage /> },
  { path: "/accounts/setup/fiscal-years", element: <FiscalYearPage /> },
  { path: "/accounts/setup/accounting-periods", element: <AccPeriodPage /> },
  { path: "/accounts/setup/parties", element: <PartyPage /> },
  { path: "/accounts/setup/party-network", element: <PartyNetworkPage /> },
  { path: "/accounts/journals", element: <JournalPage /> },
  { path: "/accounts/reports/fstatements", element: <Fstatements /> },
  { path: "/accounts/reports/fstatements-bk", element: <Fstatements_bk /> },
];

export default routes;
