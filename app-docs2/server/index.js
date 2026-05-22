import express from 'express';
import cors from 'cors';
import { pool } from './db.js';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Health
app.post('/api/health', async (req, res) => {
  res.json({ ok: true });
});

// Routes (POST-only)
import featuresRoute from './featuresRoute.js';
import tablesRoute from './tablesRoute.js';
import columnsRoute from './columnsRoute.js';
import featuretableRoute from './featuretableRoute.js';
import taskRoute from './taskRoute.js';

app.use('/api/features', featuresRoute);
app.use('/api/tables', tablesRoute);
app.use('/api/columns', columnsRoute);
app.use('/api/feature-tables', featuretableRoute);
app.use('/api/tasks', taskRoute);

app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`);
});


export { app, pool };

