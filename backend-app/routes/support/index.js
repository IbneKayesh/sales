const express = require("express");
const router = express.Router();

const grainsRoutes = require("./grains.routes.js");
const notesRoutes = require("./notes.routes.js");
const sessionsRoutes = require("./sessions.routes.js");
const ticketsRoutes = require("./tickets.routes.js");
const socialsRoutes = require("./socials.routes.js");

router.use("/grains", grainsRoutes);
router.use("/notes", notesRoutes);
router.use("/sessions", sessionsRoutes);
router.use("/tickets", ticketsRoutes);
router.use("/socials", socialsRoutes);

module.exports = router;
