import express from "express";
import documentsRouter from "./routes/documents.js";
import collectionsRouter from "./routes/collections.js";
import modelsRouter from "./routes/models.js";
import { initializeStorage } from "./storage/index.js";
import { errorHandler } from "./middleware/error-handler.js";
import { cors } from "./middleware/cors.js";

const app = express();

app.use(cors);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    storage: "FileBase",
    status: "running"
  });
});

app.use("/api/models", modelsRouter);
app.use("/api/collections", collectionsRouter);
app.use("/api", documentsRouter);

app.use(errorHandler);

const PORT = 3001;

await initializeStorage();

app.listen(PORT, "127.0.0.1", () => {
  console.log(`FileBase API running on http://127.0.0.1:${PORT}`);
});
