const express = require("express");
const router = express.Router();

const coaV1Routes = require("./coa.v1.routes.js");
const coaNetworkV1Routes = require("./coaNetwork.v1.routes.js");
const fiscalYearV1Routes = require("./fiscalYear.v1.routes.js");
const accountPeriodsV1Routes = require("./accountPeriods.v1.routes.js");
const partyV1Routes = require("./party.v1.routes.js");
const journalV1Routes = require("./journal.v1.routes.js");
const reportsV1Routes = require("./reports.v1.routes.js");
const receivablesV1Routes = require("./receivables.v1.routes.js");
const payablesV1Routes = require("./payables.v1.routes.js");
const payLocalV1Routes = require("./payLocal.v1.routes.js");

router.use("/v1/coa", coaV1Routes);
router.use("/v1/coa-network", coaNetworkV1Routes);
router.use("/v1/fiscal-years", fiscalYearV1Routes);
router.use("/v1/accounting-periods", accountPeriodsV1Routes);
router.use("/v1/parties", partyV1Routes);
router.use("/v1/journal", journalV1Routes);
router.use("/v1/reports", reportsV1Routes);
router.use("/v1/receivables", receivablesV1Routes);
router.use("/v1/payables", payablesV1Routes);
router.use("/v1/pay-local", payLocalV1Routes);
module.exports = router;
