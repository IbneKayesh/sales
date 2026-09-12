const express = require("express");
const router = express.Router();

const teachV1Routes = require("./teach.v1.routes.js");
const examsV1Routes = require("./exams.v1.routes.js");

router.use("/v1/teach", teachV1Routes);
router.use("/v1/exams", examsV1Routes);

module.exports = router;
