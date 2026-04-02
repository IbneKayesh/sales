const express = require("express");
const router = express.Router();

const employeesRoutes = require("./employees.routes.js");
const empSalaryRoutes = require("./empSalary.routes.js");
const attendanceRoutes = require("./attendance.routes.js");
const attendanceLogRoutes = require("./attendanceLog.routes.js");
const workingShiftRoutes = require("./workingShift.routes.js");
const holidaysRoutes = require("./holidays.routes.js");
const attendStatusRoutes = require("./attendStatus.routes.js");
const empLeaveRoutes = require("./empLeave.routes.js");
const salaryCycleRoutes = require("./salaryCycle.routes.js");

router.use("/employees", employeesRoutes);
router.use("/employees/salary", empSalaryRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/attendance/attendance-log", attendanceLogRoutes);
router.use("/setup/working-shift", workingShiftRoutes);
router.use("/setup/holidays", holidaysRoutes);
router.use("/setup/attend-status", attendStatusRoutes);
router.use("/attendance/emp-leave", empLeaveRoutes);
router.use("/setup/salary-cycle", salaryCycleRoutes);

module.exports = router;
