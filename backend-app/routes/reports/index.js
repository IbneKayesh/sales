const express = require("express");
const router = express.Router();

const shopRoutes = require("./shop.routes.js");
const dashboardV1Routes = require("./dashboard.v1.routes.js");

router.use("/shop", shopRoutes);
router.use("/v1/dashboard", dashboardV1Routes);

module.exports = router;
