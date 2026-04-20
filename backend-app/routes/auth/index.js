const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes.js");
const authV1Route = require("./auth.v1.route.js");

router.use("/", authRoutes);
router.use("/v1/", authV1Route);

module.exports = router;
