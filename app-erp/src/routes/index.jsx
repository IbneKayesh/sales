import React from "react";
import crmRoutes from "./crmRoutes";
import inventoryRoutes from "./inventoryRoutes";
import accountsRoutes from "./accountsRoutes";
import hrmsRoutes from "./hrmsRoutes";
import purchaseRoutes from "./purchaseRoutes";
import salesRoutes from "./salesRoutes";
import supportRoutes from "./supportRoutes";
import setupRoutes from "./setupRoutes";
import reportsRoutes from "./reportsRoutes";
import coreRoutes from "./coreRoutes";

const AppRoutesList = (
  <>
    {coreRoutes}
    {crmRoutes}
    {inventoryRoutes}
    {accountsRoutes}
    {hrmsRoutes}
    {purchaseRoutes}
    {salesRoutes}
    {supportRoutes}
    {setupRoutes}
    {reportsRoutes}
  </>
);

export default AppRoutesList;
