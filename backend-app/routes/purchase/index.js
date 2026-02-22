const express = require("express");
const router = express.Router();

const pbookingRoutes = require("./pbooking.routes.js");
const preceiptRoutes = require("./preceipt.routes.js");
const pinvoiceRoutes = require("./pinvoice.routes.js");

router.use("/pbooking", pbookingRoutes);
router.use("/preceipt", preceiptRoutes);
router.use("/pinvoice", pinvoiceRoutes);

module.exports = router;
