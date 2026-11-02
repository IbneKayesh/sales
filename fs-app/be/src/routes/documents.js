import { Router } from "express";
import db from "../storage/index.js";
import { StorageError } from "../storage/errors.js";

const router = Router();

// GET /api/:collection/count
router.get("/:collection/count", async (req, res, next) => {
  try {
    const collection = db.collection(req.params.collection);

    const filter = req.query.filter
      ? JSON.parse(req.query.filter)
      : {};

    const count = await collection.count(filter);

    res.json({ success: true, count });
  } catch (error) {
    next(error);
  }
});

// POST /api/:collection
router.post("/:collection", async (req, res, next) => {
  try {
    const collection = db.collection(req.params.collection);

    // Ensure the collection directory exists before inserting
    await collection.initialize();

    const document = await collection.insert(req.body);

    res.status(201).json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/:collection
router.get("/:collection", async (req, res, next) => {
  try {
    const collection = db.collection(req.params.collection);

    const filter = req.query.filter
      ? JSON.parse(req.query.filter)
      : {};

    const sort = req.query.sort
      ? JSON.parse(req.query.sort)
      : { createdAt: -1 };

    const limit = Math.min(
      Math.max(Number(req.query.limit) || 100, 1),
      1000
    );

    const offset = Math.max(
      Number(req.query.offset) || 0,
      0
    );

    const data = await collection.find(filter, {
      limit,
      offset,
      sort
    });

    res.json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/:collection/:id
router.get("/:collection/:id", async (req, res, next) => {
  try {
    const document = await db
      .collection(req.params.collection)
      .findById(req.params.id);

    if (!document) {
      throw new StorageError("Document not found", 404);
    }

    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/:collection/:id
router.patch("/:collection/:id", async (req, res, next) => {
  try {
    const document = await db
      .collection(req.params.collection)
      .update(req.params.id, req.body);

    res.json({
      success: true,
      data: document
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/:collection/:id
router.delete("/:collection/:id", async (req, res, next) => {
  try {
    const deleted = await db
      .collection(req.params.collection)
      .delete(req.params.id);

    if (!deleted) {
      throw new StorageError("Document not found", 404);
    }

    res.json({
      success: true,
      message: "Document deleted"
    });
  } catch (error) {
    next(error);
  }
});

export default router;