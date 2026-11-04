import { Router } from "express";
import { listModels } from "../models/index.js";

const router = Router();

// GET /api/models - every table model, keyed by collection.
router.get("/", async (req, res, next) => {
  try {
    res.json({ success: true, data: await listModels() });
  } catch (error) {
    next(error);
  }
});

export default router;
