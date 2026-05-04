import React from "react";
import { Route } from "react-router-dom";

const ContactsPage = React.lazy(
  () => import("../pages/crm/contacts/ContactsPage"),
);
const DZonePage = React.lazy(() => import("../pages/crm/dzone/DZonePage"));
const TAreaPage = React.lazy(() => import("../pages/crm/tarea/TAreaPage"));
const TerritoryPage = React.lazy(() => import("../pages/crm/territory/TerritoryPage"));
const InquiryPage = React.lazy(() => import("../pages/crm/InquiryPage"));

const crmRoutes = (
  <>
    <Route path="/crm/contacts" element={<ContactsPage />} />
    <Route path="/crm/setup/dzone" element={<DZonePage />} />
    <Route path="/crm/setup/tarea" element={<TAreaPage />} />
    <Route path="/crm/setup/territory" element={<TerritoryPage />} />
    <Route path="/crm/inquiry" element={<InquiryPage />} />
  </>
);

export default crmRoutes;
