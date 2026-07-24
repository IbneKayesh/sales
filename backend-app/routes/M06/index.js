const express = require("express");
const router = express.Router();

const contactsV1Routes = require("./contacts.v1.routes.js");
const dzoneV1Routes = require("./dzone.v1.routes.js");
const tareaV1Routes = require("./tarea.v1.routes.js");
const territoryV1Routes = require("./territory.v1.routes.js");


router.use("/v1/contacts", contactsV1Routes);
router.use("/v1/dzones", dzoneV1Routes);
router.use("/v1/tareas", tareaV1Routes);
router.use("/v1/territories", territoryV1Routes);
module.exports = router;
