const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes.js");
const authV1Routes = require("./auth.v1.routes.js");

router.use("/", authRoutes);
router.use("/v1/", authV1Routes);

module.exports = router;
