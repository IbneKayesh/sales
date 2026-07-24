const express = require("express");
const router = express.Router();


const coaV1Routes = require("./coa.v1.routes.js");
const fiscalYearV1Routes = require("./fiscalYear.v1.routes.js");
const accountPeriodsV1Routes = require("./accountPeriods.v1.routes.js");


router.use("/v1/coa", coaV1Routes);
router.use("/v1/fiscal-years", fiscalYearV1Routes);
router.use("/v1/accounting-periods", accountPeriodsV1Routes);
module.exports = router;
