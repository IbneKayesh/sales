import express from 'express';
import cors from 'cors';
import { query } from './db.js';
import { initializeSchema } from './schema.js';
import projectsRouter from './routes/projects.js';
import modulesRouter from './routes/modules.js';
import submodulesRouter from './routes/submodules.js';
import featuresRouter from './routes/features.js';
import tablesRouter from './routes/tables.js';
import columnsRouter from './routes/columns.js';
import activityLogRouter from './routes/activityLog.js';
import dashboardRouter from './routes/dashboard.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Initialize schema on server startup
initializeSchema();

// --- DB Status Endpoint ---
app.get('/api/db-status', async (req, res) => {
  try {
    const projectsCount = await query('SELECT COUNT(*) FROM t_projects');
    const modulesCount = await query('SELECT COUNT(*) FROM t_modules');
    const submodulesCount = await query('SELECT COUNT(*) FROM t_submodules');
    const tablesCount = await query('SELECT COUNT(*) FROM t_tables');
    const columnsCount = await query('SELECT COUNT(*) FROM t_columns');
    const featuresCount = await query('SELECT COUNT(*) FROM t_features');
    const tableFeaturCount = await query('SELECT COUNT(*) FROM t_table_features');
    
    res.json({
      status: 'connected',
      counts: {
        projects: parseInt(projectsCount.rows[0].count, 10),
        modules: parseInt(modulesCount.rows[0].count, 10),
        submodules: parseInt(submodulesCount.rows[0].count, 10),
        tables: parseInt(tablesCount.rows[0].count, 10),
        columns: parseInt(columnsCount.rows[0].count, 10),
        features: parseInt(featuresCount.rows[0].count, 10),
        tableFeatures: parseInt(tableFeaturCount.rows[0].count, 10)
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to query database',
      error: err.message
    });
  }
});

// --- MOUNT MODULAR ROUTES ---
app.use('/api/projects', projectsRouter);
app.use('/api/modules', modulesRouter);
app.use('/api/submodules', submodulesRouter);
app.use('/api/features', featuresRouter);
app.use('/api/tables', tablesRouter);
app.use('/api/columns', columnsRouter);
app.use('/api/activity-log', activityLogRouter);
app.use('/api/dashboard', dashboardRouter);

// --- TABLE FEATURES RELATIONSHIP ENDPOINTS ---
app.get('/api/table-features', async (req, res) => {
  const { table_id, feature_id } = req.query;
  try {
    let result;
    if (table_id) {
      result = await query(
        'SELECT tf.*, t.table_name, f.feature_name FROM t_table_features tf JOIN t_tables t ON tf.table_id = t.id JOIN t_features f ON tf.feature_id = f.id WHERE tf.table_id = $1 ORDER BY tf.id ASC',
        [table_id]
      );
    } else if (feature_id) {
      result = await query(
        'SELECT tf.*, t.table_name, f.feature_name FROM t_table_features tf JOIN t_tables t ON tf.table_id = t.id JOIN t_features f ON tf.feature_id = f.id WHERE tf.feature_id = $1 ORDER BY tf.id ASC',
        [feature_id]
      );
    } else {
      result = await query(
        'SELECT tf.*, t.table_name, f.feature_name FROM t_table_features tf JOIN t_tables t ON tf.table_id = t.id JOIN t_features f ON tf.feature_id = f.id ORDER BY tf.id ASC'
      );
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/table-features', async (req, res) => {
  const { table_id, feature_id } = req.body;
  if (!table_id || !feature_id) {
    return res.status(400).json({ error: 'table_id and feature_id are required' });
  }
  try {
    const result = await query(
      'INSERT INTO t_table_features (table_id, feature_id) VALUES ($1, $2) RETURNING *',
      [table_id, feature_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/table-features/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM t_table_features WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Table-Feature relationship not found' });
    res.json({ message: 'Relationship deleted successfully', deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
