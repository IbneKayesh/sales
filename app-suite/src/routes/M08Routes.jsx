import COAPage from "@/pages/M08/setup/coa/COAPage";
import AccPeriodPage from "@/pages/M08/setup/accountingperiods/AccPeriodPage";
import FiscalYearPage from "@/pages/M08/setup/fiscalyears/FiscalYearPage";
import PartyPage from "@/pages/M08/setup/parties/PartyPage";
import PartyAutoPage from "@/pages/M08/setup/partyauto/PartyAutoPage";
import JournalPage from "@/pages/M08/journals/JournalPage";
import Fstatements from "@/pages/M08/reports/Fstatements";

const routes = [
  { path: "/accounts/setup/chart-of-accounts", element: <COAPage /> },
  { path: "/accounts/setup/fiscal-years", element: <FiscalYearPage /> },
  { path: "/accounts/setup/accounting-periods", element: <AccPeriodPage /> },
  { path: "/accounts/setup/parties", element: <PartyPage /> },
  { path: "/accounts/setup/party-auto", element: <PartyAutoPage /> },
  { path: "/accounts/journals", element: <JournalPage /> },
  { path: "/accounts/reports/fstatements", element: <Fstatements /> },
];

export default routes;
