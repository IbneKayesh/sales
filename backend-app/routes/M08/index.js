const express = require("express");
const router = express.Router();


const coaV1Routes = require("./coa.v1.routes.js");


router.use("/v1/coa", coaV1Routes);
module.exports = router;
