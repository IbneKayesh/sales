import COAPage from "@/pages/M08/setup/coa/COAPage";
import AccountingPeriodPage from "@/pages/M08/setup/accountingperiods/AccountingPeriodPage";
import FiscalYearPage from "@/pages/M08/setup/fiscalyears/FiscalYearPage";
import PartyPage from "@/pages/M08/setup/parties/PartyPage";

const routes = [
  { path: "/accounts/setup/chart-of-accounts", element: <COAPage /> },
  { path: "/M08/accounting-periods", element: <AccountingPeriodPage /> },
  { path: "/M08/fiscal-years", element: <FiscalYearPage /> },
  { path: "/M08/parties", element: <PartyPage /> },
];

export default routes;
