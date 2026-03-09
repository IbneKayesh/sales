import React from "react";
import { Route } from "react-router-dom";

const EmployeesPage = React.lazy(() => import("../pages/hrms/employee/EmployeesPage.jsx"));

const hrmsRoutes = (
  <>
    <Route path="hrms/employees" element={<EmployeesPage />} />
  </>
);

export default hrmsRoutes;
