import React from "react";
import { Route } from "react-router-dom";

const EmployeesPage = React.lazy(() => import("../pages/hrms/employee/EmployeesPage.jsx"));
const WorkingShiftPage = React.lazy(() => import("../pages/hrms/workingshift/WorkingShiftPage.jsx"));
const AttendLogPage = React.lazy(() => import("../pages/hrms/attendlog/AttendLogPage.jsx"));
const LeaveEntitlePage = React.lazy(() => import("../pages/hrms/leaveentitle/LeaveEntitlePage.jsx"));
const HolidaysPage = React.lazy(() => import("../pages/hrms/holidays/HolidaysPage.jsx"));
const AttendStatusPage = React.lazy(() => import("../pages/hrms/attendstatus/AttendStatusPage.jsx"));
const AttendancePage = React.lazy(() => import("../pages/hrms/attendance/AttendancePage.jsx"));
const SalaryCyclePage = React.lazy(() => import("../pages/hrms/salaryCycle/SalaryCyclePage.jsx"));

const hrmsRoutes = (
  <>
    <Route path="hrms/employees" element={<EmployeesPage />} />
    <Route path="hrms/setup/working-shift" element={<WorkingShiftPage />} />
    <Route path="hrms/setup/holidays" element={<HolidaysPage />} />
    <Route path="hrms/setup/leave-entitle" element={<LeaveEntitlePage />} />
    <Route path="hrms/setup/attend-status" element={<AttendStatusPage />} />
    <Route path="hrms/attendance/attend-log" element={<AttendLogPage />} />
    <Route path="hrms/attendance/attendance" element={<AttendancePage />} />
    <Route path="hrms/setup/salary-cycle" element={<SalaryCyclePage />} />
  </>
);

export default hrmsRoutes;
