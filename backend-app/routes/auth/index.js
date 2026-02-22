const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes.js");

router.use("/", authRoutes);

module.exports = router;
