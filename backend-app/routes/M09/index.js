const express = require("express");
const router = express.Router();

const reportsV1Routes = require("./reports.v1.routes.js");

router.use("/v1/reports", reportsV1Routes);
module.exports = router;
