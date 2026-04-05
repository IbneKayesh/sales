import React from "react";
import { Route } from "react-router-dom";

const ContactPage = React.lazy(() => import("../pages/crm/contacts/ContactPage.jsx"));
const OrderRoutePage = React.lazy(() => import("../pages/crm/orderroute/OrderRoutePage.jsx"));
const DeliveryVanPage = React.lazy(() => import("../pages/crm/deliveryvan/DeliveryVanPage.jsx"));
const DZonePage = React.lazy(() => import("../pages/crm/dzone/DZonePage.jsx"));
const TAreaPage = React.lazy(() => import("../pages/crm/tarea/TAreaPage.jsx"));
const TerritoryPage = React.lazy(() => import("../pages/crm/territory/TerritoryPage.jsx"));

const crmRoutes = (
  <>
    <Route path="crm/contact" element={<ContactPage />} />
    <Route path="crm/order-route" element={<OrderRoutePage />} />
    <Route path="crm/delivery-van" element={<DeliveryVanPage />} />
    <Route path="crm/dzone" element={<DZonePage />} />
    <Route path="crm/tarea" element={<TAreaPage />} />
    <Route path="crm/territory" element={<TerritoryPage />} />
  </>
);

export default crmRoutes;