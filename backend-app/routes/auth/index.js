const express = require("express");
const router = express.Router();

const authV1Routes = require("./auth.v1.routes.js");

router.use("/v1/", authV1Routes);

module.exports = router;
