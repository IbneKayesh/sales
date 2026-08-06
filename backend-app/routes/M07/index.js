const express = require("express");
const router = express.Router();

const workingShiftV1Routes = require("./workingShift.v1.routes.js");
const holidaysV1Routes = require("./holidays.v1.routes.js");
const designationsV1Routes = require("./designations.v1.routes.js");


router.use("/v1/working-shift", workingShiftV1Routes);
router.use("/v1/holidays", holidaysV1Routes);
router.use("/v1/designations", designationsV1Routes);
module.exports = router;
