import React from "react";
import { Route } from "react-router-dom";

const ContactsPage = React.lazy(() => import("../pages/crm/contacts/ContactsPage"));
const DZonePage = React.lazy(() => import("../pages/crm/dzone/DZonePage"));
const InquiryPage = React.lazy(() => import("../pages/crm/InquiryPage"));

const crmRoutes = (
  <>
    <Route path="/crm/contacts" element={<ContactsPage />} />
    <Route path="/crm/setup/dzone" element={<DZonePage />} />
    <Route path="/crm/inquiry" element={<InquiryPage />} />
  </>
);

export default crmRoutes;
