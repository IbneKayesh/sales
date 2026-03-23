import React from "react";
import { Route } from "react-router-dom";

const AccountsPage = React.lazy(() => import("../pages/accounts/accounts/AccountsPage"));
const HeadsPage = React.lazy(() => import("../pages/accounts/heads/HeadsPage"));
const LedgerPage = React.lazy(() => import("../pages/accounts/ledger/LedgerPage"));
const PayablesPage = React.lazy(() => import("../pages/accounts/payables/PayablesPage"));
const ReceivablesPage = React.lazy(() => import("../pages/accounts/receivables/ReceivablesPage"));
const ExpensesPage = React.lazy(() => import("../pages/accounts/expneses/ExpensesPage"));
const ExpCategoryPage = React.lazy(() => import("../pages/accounts/expcategory/ExpCategoryPage"));

const accountsRoutes = (
  <>
    <Route path="accounts/setup/accounts" element={<AccountsPage />} />
    <Route path="accounts/setup/heads" element={<HeadsPage />} />
    <Route path="accounts/ledger" element={<LedgerPage />} />
    <Route path="accounts/payables" element={<PayablesPage />} />
    <Route path="accounts/receivables" element={<ReceivablesPage />} />
    <Route path="accounts/expenses" element={<ExpensesPage />} />
    <Route path="accounts/expenses/category" element={<ExpCategoryPage />} />
  </>
);

export default accountsRoutes;
