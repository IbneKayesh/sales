const express = require("express");
const router = express.Router();

const employeesRoutes = require("./employees.routes.js");

router.use("/employees", employeesRoutes);

module.exports = router;
