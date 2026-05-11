import React from "react";
import { Route } from "react-router-dom";

const CoaPage = React.lazy(() => import("../pages/accounts/setup/coa/CoaPage"));
const PartiesPage = React.lazy(() => import("../pages/accounts/setup/parties/PartiesPage"));
const JournalPage = React.lazy(() => import("../pages/accounts/journal/JournalPage"));
const ReportsPage = React.lazy(() => import("../pages/accounts/reports/ReportsPage"));

const accountsRoutes = (
  <>
    <Route path="/accounts/setup/coa" element={<CoaPage />} />
    <Route path="/accounts/setup/parties" element={<PartiesPage />} />
    <Route path="/accounts/journal-voucher" element={<JournalPage />} />
    <Route path="/accounts/reports/trial-balance" element={<ReportsPage />} />
  </>
);

export default accountsRoutes;
