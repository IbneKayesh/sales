const express = require("express");
const router = express.Router();

const employeesRoutes = require("./employees.routes.js");
const workingShiftRoutes = require("./workingShift.routes.js");
const attendanceLogRoutes = require("./attendanceLog.routes.js");



router.use("/employees", employeesRoutes);
router.use("/setup/working-shift", workingShiftRoutes);
router.use("/attendance/attendance-log", attendanceLogRoutes);


module.exports = router;
