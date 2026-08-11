const express = require("express");
const router = express.Router();

const invoiceV1Routes = require("./invoice.v1.routes.js");


router.use("/v1/invoice", invoiceV1Routes);
module.exports = router;
