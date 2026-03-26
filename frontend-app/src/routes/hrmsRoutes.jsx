import React from "react";
import { Route } from "react-router-dom";

const EmployeesPage = React.lazy(() => import("../pages/hrms/employee/EmployeesPage.jsx"));
const WorkingShiftPage = React.lazy(() => import("../pages/hrms/workingshift/WorkingShiftPage.jsx"));
const AttendanceLogPage = React.lazy(() => import("../pages/hrms/attendancelog/AttendanceLogPage.jsx"));

const hrmsRoutes = (
  <>
    <Route path="hrms/employees" element={<EmployeesPage />} />
    <Route path="hrms/setup/working-shift" element={<WorkingShiftPage />} />
    <Route path="hrms/attendance/attendance-log" element={<AttendanceLogPage />} />
  </>
);

export default hrmsRoutes;
