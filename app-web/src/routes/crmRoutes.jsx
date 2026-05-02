import React from "react";
import { Route } from "react-router-dom";

const ContactPage = React.lazy(() => import("../pages/crm/ContactPage"));
const CountryPage = React.lazy(() => import("../pages/crm/CountryPage"));
const InquiryPage = React.lazy(() => import("../pages/crm/InquiryPage"));

const crmRoutes = (
  <>
    <Route path="/crm/contacts" element={<ContactPage />} />
    <Route path="/crm/country" element={<CountryPage />} />
    <Route path="/crm/inquiry" element={<InquiryPage />} />
  </>
);

export default crmRoutes;
