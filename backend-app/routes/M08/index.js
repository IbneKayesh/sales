const express = require("express");
const router = express.Router();


const coaV1Routes = require("./coa.v1.routes.js");
const fiscalYearV1Routes = require("./fiscalYear.v1.routes.js");
const accountPeriodsV1Routes = require("./accountPeriods.v1.routes.js");
const partyV1Routes = require("./party.v1.routes.js");
const partyNetworkV1Routes = require("./partyNetwork.v1.routes");
const journalV1Routes = require("./journal.v1.routes.js");
const reportsV1Routes = require("./reports.v1.routes.js");
const paymentsV1Routes = require("./payments.v1.routes.js");


router.use("/v1/coa", coaV1Routes);
router.use("/v1/fiscal-years", fiscalYearV1Routes);
router.use("/v1/accounting-periods", accountPeriodsV1Routes);
router.use("/v1/parties", partyV1Routes);
router.use("/v1/party-network", partyNetworkV1Routes);
router.use("/v1/journal", journalV1Routes);
router.use("/v1/reports", reportsV1Routes);
router.use("/v1/payments",paymentsV1Routes);
module.exports = router;
