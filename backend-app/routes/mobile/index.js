const express = require("express");
const router = express.Router();

const mauthRoutes = require("./auth/mauth.routes.js");
const mordersRoutes = require("./sales/morders.routes.js");

router.use("/auth", mauthRoutes);
router.use("/sales/orders", mordersRoutes);

module.exports = router;
