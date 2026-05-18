const express = require("express");
const router = express.Router();

const accountsRoutes = require("./accounts.routes.js");
const accountsLedgerRoutes = require("./accountsLedger.routes.js");
const expensesRoutes = require("./expenses.routes.js");
const expensesCategoryRoutes = require("./expensesCategory.routes.js");
const payablesRoutes = require("./payables.routes.js");
const receivablesRoutes = require("./receivables.routes.js");

router.use("/accounts", accountsRoutes);
router.use("/accounts-ledgers", accountsLedgerRoutes);
router.use("/expenses", expensesRoutes);
router.use("/expenses/category", expensesCategoryRoutes);
router.use("/payables", payablesRoutes);
router.use("/receivables", receivablesRoutes);




const coaV1Routes = require("./coa.v1.routes.js");
const partyV1Routes = require("./party.v1.routes.js");
const journalV1Routes = require("./journal.v1.routes.js");
const fiscalYearV1Routes = require("./fiscalYear.v1.routes.js");
const accountPeriodsV1Routes = require("./accountPeriods.v1.routes.js");
const reportsV1Routes = require("./reports.v1.routes.js");
const autoJournalV1Routes = require("./autoJournal.v1.routes");
const accountsV1Routes = require("./accounts.v1.routes.js");

router.use("/v1/coa", coaV1Routes);
router.use("/v1/party", partyV1Routes);
router.use("/v1/journal", journalV1Routes);
router.use("/v1/fiscal-year", fiscalYearV1Routes);
router.use("/v1/account-period", accountPeriodsV1Routes);
router.use("/v1/reports", reportsV1Routes);
router.use("/v1/auto-journal", autoJournalV1Routes);
router.use("/v1/accounts", accountsV1Routes);

module.exports = router;
