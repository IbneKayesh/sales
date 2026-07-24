import COAPage from "@/pages/M08/setup/coa/COAPage";
import AccPeriodPage from "@/pages/M08/setup/accountingperiods/AccPeriodPage";
import FiscalYearPage from "@/pages/M08/setup/fiscalyears/FiscalYearPage";
import PartyPage from "@/pages/M08/setup/parties/PartyPage";

const routes = [
  { path: "/accounts/setup/chart-of-accounts", element: <COAPage /> },
  { path: "/accounts/setup/fiscal-years", element: <FiscalYearPage /> },
  { path: "/accounts/setup/accounting-periods", element: <AccPeriodPage /> },
  { path: "/M08/parties", element: <PartyPage /> },
];

export default routes;
