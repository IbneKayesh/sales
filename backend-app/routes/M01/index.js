const express = require("express");
const router = express.Router();

const departmentsV1Routes = require("./departments.v1.routes.js");
const sectionsV1Routes = require("./sections.v1.routes.js");
const tabColumnsV1Routes = require("./tabColumns.v1.routes.js");
const featuresV1Routes = require("./features.v1.routes.js");
const pendingProcessV1Routes = require("./pendingProcess.v1.routes.js");
const usersV1Routes = require("./users.v1.routes.js");

router.use("/v1/departments", departmentsV1Routes);
router.use("/v1/sections", sectionsV1Routes);
router.use("/v1/tab-columns", tabColumnsV1Routes);
router.use("/v1/features", featuresV1Routes);
router.use("/v1/pending-process", pendingProcessV1Routes);
router.use("/v1/users", usersV1Routes);
module.exports = router;
