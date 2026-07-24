import WorkShiftPage from "@/pages/M07/setup/workshift/WorkShiftPage";
import AttendLogPage from "@/pages/M07/attend/attendLog/AttendLogPage";
import HolidayPage from "@/pages/M07/setup/holiday/HolidayPage";
import EmployeePage from "@/pages/M07/setup/employees/EmployeePage";

const routes = [
  { path: "/hrms/setup/work-shifts", element: <WorkShiftPage /> },
  { path: "/hrms/setup/holidays", element: <HolidayPage /> },
  { path: "/M07/attend-logs", element: <AttendLogPage /> },
  { path: "/M07/employees", element: <EmployeePage /> },
];

export default routes;
