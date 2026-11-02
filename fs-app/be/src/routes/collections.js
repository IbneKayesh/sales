import { Router } from "express";
import fs from "node:fs/promises";
import db from "../storage/index.js";

const router = Router();

// List all collections (directories under collectionsPath)
router.get("/", async (req, res, next) => {
  try {
    const entries = await fs.readdir(db.collectionsPath, {
      withFileTypes: true
    });

    const collections = entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name);

    res.json({ success: true, data: collections });
  } catch (error) {
    next(error);
  }
});

// Create a new collection (just ensure the directory exists)
router.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, error: "Collection name is required" });
    }

    const col = db.collection(name);
    await col.initialize();

    res.status(201).json({ success: true, data: { name } });
  } catch (error) {
    next(error);
  }
});

// Drop a collection (delete all documents + directory)
router.delete("/:name", async (req, res, next) => {
  try {
    const col = db.collection(req.params.name);

    await fs.rm(col.directory, { recursive: true, force: true });

    res.json({ success: true, message: "Collection dropped" });
  } catch (error) {
    next(error);
  }
});

export default router;
