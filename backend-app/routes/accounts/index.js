const express = require("express");
const router = express.Router();

const accountsRoutes = require("./accounts.routes.js");
const accountsHeadsRoutes = require("./accountsHeads.routes.js");
const accountsLedgerRoutes = require("./accountsLedger.routes.js");
const payablesRoutes = require("./payables.routes.js");
const receivablesRoutes = require("./receivables.routes.js");
const expensesRoutes = require("./expenses.routes.js");

router.use("/accounts", accountsRoutes);
router.use("/accounts-heads", accountsHeadsRoutes);
router.use("/accounts-ledgers", accountsLedgerRoutes);
router.use("/payables", payablesRoutes);
router.use("/receivables", receivablesRoutes);
router.use("/expenses", expensesRoutes);

module.exports = router;
