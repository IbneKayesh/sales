const express = require("express");
const router = express.Router();

const shortdataV1Routes = require("./shortdata.v1.routes.js");
const usersV1Routes = require("./users.v1.routes.js");
const businessV1Routes = require("./business.v1.routes");

router.use("/v1/short-data", shortdataV1Routes);
router.use("/v1/users", usersV1Routes);
router.use("/v1/business", businessV1Routes);

module.exports = router;