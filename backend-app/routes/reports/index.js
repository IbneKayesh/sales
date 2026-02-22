const express = require("express");
const router = express.Router();

const shopRoutes = require("./shop.routes.js");

router.use("/shop", shopRoutes);

module.exports = router;
