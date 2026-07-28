const express = require("express");
const router = express.Router();

const mrrV1Routes = require("./mrr.v1.routes.js");


router.use("/v1/mrr", mrrV1Routes);
module.exports = router;
