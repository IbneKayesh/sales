import ChartOfAccountsPage from "@/pages/M08/setup/coa/ChartOfAccountsPage";
import AccountingPeriodPage from "@/pages/M08/setup/accountingperiods/AccountingPeriodPage";
import FiscalYearPage from "@/pages/M08/setup/fiscalyears/FiscalYearPage";
import PartyPage from "@/pages/M08/setup/parties/PartyPage";

const routes = [
  { path: "/M08/chart-of-accounts", element: <ChartOfAccountsPage /> },
  { path: "/M08/accounting-periods", element: <AccountingPeriodPage /> },
  { path: "/M08/fiscal-years", element: <FiscalYearPage /> },
  { path: "/M08/parties", element: <PartyPage /> },
];

export default routes;
