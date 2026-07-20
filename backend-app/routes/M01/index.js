const express = require("express");
const router = express.Router();

const departmentsV1Routes = require("./departments.v1.routes.js");


router.use("/v1/departments", departmentsV1Routes);
module.exports = router;
