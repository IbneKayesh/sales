const express = require("express");
const router = express.Router();

const productionsV1Routes = require("./productions.v1.routes.js");


router.use("/v1/productions", productionsV1Routes);
module.exports = router;
