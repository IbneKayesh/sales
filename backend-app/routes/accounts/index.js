const express = require("express");
const router = express.Router();

const accountsRoutes = require("./accounts.routes.js");
const accountsHeadsRoutes = require("./accountsHeads.routes.js");
const accountsLedgerRoutes = require("./accountsLedger.routes.js");
const expensesRoutes = require("./expenses.routes.js");
const expensesCategoryRoutes = require("./expensesCategory.routes.js");
const payablesRoutes = require("./payables.routes.js");
const receivablesRoutes = require("./receivables.routes.js");
const accountsV1Routes = require("./accounts.v1.routes.js");

router.use("/accounts", accountsRoutes);
router.use("/accounts-heads", accountsHeadsRoutes);
router.use("/accounts-ledgers", accountsLedgerRoutes);
router.use("/expenses", expensesRoutes);
router.use("/expenses/category", expensesCategoryRoutes);
router.use("/payables", payablesRoutes);
router.use("/receivables", receivablesRoutes);
router.use("/v1/accounts", accountsV1Routes);

const accountHeadsV1Routes = require("./accountHeads.v1.routes.js");
router.use("/v1/account-heads", accountHeadsV1Routes);

module.exports = router;
