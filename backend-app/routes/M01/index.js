const express = require("express");
const router = express.Router();

const departmentsV1Routes = require("./departments.v1.routes.js");
const sectionsV1Routes = require("./sections.v1.routes.js");


router.use("/v1/departments", departmentsV1Routes);
router.use("/v1/sections", sectionsV1Routes);
module.exports = router;
