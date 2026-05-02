import React from "react";
import { Route } from "react-router-dom";

const ContactsPage = React.lazy(() => import("../pages/crm/contacts/ContactsPage"));
const CountryPage = React.lazy(() => import("../pages/crm/CountryPage"));
const InquiryPage = React.lazy(() => import("../pages/crm/InquiryPage"));

const crmRoutes = (
  <>
    <Route path="/crm/contacts" element={<ContactsPage />} />
    <Route path="/crm/country" element={<CountryPage />} />
    <Route path="/crm/inquiry" element={<InquiryPage />} />
  </>
);

export default crmRoutes;
