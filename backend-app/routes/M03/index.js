const express = require("express");
const router = express.Router();

const mrrV1Routes = require("./mrr.v1.routes.js");
const porV1Routes = require("./por.v1.routes.js");


router.use("/v1/mrr", mrrV1Routes);
router.use("/v1/por", porV1Routes);
module.exports = router;