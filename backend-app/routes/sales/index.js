const express = require("express");
const router = express.Router();

const sbookingRoutes = require("./sbooking.routes.js");
const sreceiptRoutes = require("./sreceipt.routes.js");
const sinvoiceRoutes = require("./sinvoice.routes.js");

router.use("/sbooking", sbookingRoutes);
router.use("/sreceipt", sreceiptRoutes);
router.use("/sinvoice", sinvoiceRoutes);

module.exports = router;
