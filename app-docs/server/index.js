import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
const port = 1701;

app.use(cors());
app.use(express.json({ limit: "1mb" }));


// Routes (POST-only)
import featuresRoute from './featuresRoute.js';
import tasksRoute from './tasksRoute.js';
import tablesRoute from './tablesRoute.js';
import columnRoute from './columnRoute.js';
import featureTableRoute from './featureTableRoute.js';


app.use('/api/features', featuresRoute);
app.use('/api/tasks', tasksRoute);
app.use('/api/tables', tablesRoute);
app.use('/api/columns', columnRoute);
app.use('/api/feature-table', featureTableRoute);

// test
app.post("/api/test", async (req, res) => {
  res.json({ success: true, message: "ok", data: [{test:"test"}] });
});

app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`);
});

export { app, pool };
