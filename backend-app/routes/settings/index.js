const express = require("express");
const router = express.Router();

const shortdataV1Routes = require("./shortdata.v1.routes.js");

router.use("/v1/short-data", shortdataV1Routes);

module.exports = router;
