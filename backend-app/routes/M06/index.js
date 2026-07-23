const express = require("express");
const router = express.Router();

const contactsV1Routes = require("./contacts.v1.routes.js");


router.use("/v1/contacts", contactsV1Routes);
module.exports = router;
