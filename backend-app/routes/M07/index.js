const express = require("express");
const router = express.Router();

const workingShiftV1Routes = require("./workingShift.v1.routes.js");


router.use("/v1/working-shift", workingShiftV1Routes);
module.exports = router;
