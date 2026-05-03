const express = require("express");
const router = express.Router();

const shortdataV1Routes = require("./shortdata.v1.routes.js");
const usersV1Routes = require("./users.v1.routes.js");

router.use("/v1/short-data", shortdataV1Routes);
router.use("/v1/users", usersV1Routes);

module.exports = router;