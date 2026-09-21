const express = require("express");
const router = express.Router();

const contactsV1Routes = require("./contacts.v1.routes.js");
const dzoneV1Routes = require("./dzone.v1.routes.js");
const tareaV1Routes = require("./tarea.v1.routes.js");
const territoryV1Routes = require("./territory.v1.routes.js");
const droutesV1Routes = require("./droutes.v1.routes.js");
const croutesV1Routes = require("./croutes.v1.routes.js");


router.use("/v1/contacts", contactsV1Routes);
router.use("/v1/dzones", dzoneV1Routes);
router.use("/v1/tareas", tareaV1Routes);
router.use("/v1/territories", territoryV1Routes);
router.use("/v1/droutes", droutesV1Routes);
router.use("/v1/croutes", croutesV1Routes);
module.exports = router;
