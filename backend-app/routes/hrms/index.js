const express = require("express");
const router = express.Router();

const employeesRoutes = require("./employees.routes.js");
const workingShiftRoutes = require("./workingShift.routes.js");
const attendanceLogRoutes = require("./attendanceLog.routes.js");
const holidaysRoutes = require("./holidays.routes.js");
const attendStatusRoutes = require("./attendStatus.routes.js");
const leaveEntitleRoutes = require("./leaveEntitle.routes.js");
const attendanceRoutes = require("./attendance.routes.js");

router.use("/employees", employeesRoutes);
router.use("/setup/working-shift", workingShiftRoutes);
router.use("/attendance/attendance-log", attendanceLogRoutes);
router.use("/setup/holidays", holidaysRoutes);
router.use("/setup/attend-status", attendStatusRoutes);
router.use("/setup/leave-entitle", leaveEntitleRoutes);
router.use("/attendance", attendanceRoutes);

module.exports = router;