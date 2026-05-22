import { Router } from 'express';
import { query } from '../db.js';

const router = Router();

router.get('/stats', async (req, res) => {
  try {
    // 1. Total counts
    const countsResult = await query(`
      SELECT 
        (SELECT COUNT(*) FROM t_projects) as projects,
        (SELECT COUNT(*) FROM t_modules) as modules,
        (SELECT COUNT(*) FROM t_submodules) as submodules,
        (SELECT COUNT(*) FROM t_features) as features,
        (SELECT COUNT(*) FROM t_tables) as tables
    `);
    const counts = {
      projects: parseInt(countsResult.rows[0].projects, 10),
      modules: parseInt(countsResult.rows[0].modules, 10),
      submodules: parseInt(countsResult.rows[0].submodules, 10),
      features: parseInt(countsResult.rows[0].features, 10),
      tables: parseInt(countsResult.rows[0].tables, 10)
    };

    // 2. Project Status Distribution
    const projectStatusResult = await query(`
      SELECT status, COUNT(*) as count 
      FROM t_projects 
      GROUP BY status
    `);
    const projectStatuses = {};
    projectStatusResult.rows.forEach(row => {
      projectStatuses[row.status] = parseInt(row.count, 10);
    });

    // 3. Feature Status Distribution
    const featureStatusResult = await query(`
      SELECT status, COUNT(*) as count 
      FROM t_features 
      GROUP BY status
    `);
    const featureStatuses = {};
    featureStatusResult.rows.forEach(row => {
      featureStatuses[row.status] = parseInt(row.count, 10);
    });

    // 4. Overdue Entities (end_date < CURRENT_DATE and status is not complete/done)
    const overdueProjects = await query(`
      SELECT id, name as title, 'project' as type, end_date, owner
      FROM t_projects
      WHERE end_date < CURRENT_DATE AND status NOT IN ('complete', 'completed', 'done')
    `);

    const overdueFeatures = await query(`
      SELECT id, feature_name as title, 'feature' as type, end_date, owner
      FROM t_features
      WHERE end_date < CURRENT_DATE AND status != 'done'
    `);

    const overdue = [
      ...overdueProjects.rows,
      ...overdueFeatures.rows
    ];

    // 5. Project Progress Summary
    const progressResult = await query(`
      SELECT COALESCE(AVG(progress), 0) as avg_progress 
      FROM t_projects
    `);
    const avgProgress = Math.round(parseFloat(progressResult.rows[0].avg_progress));

    res.json({
      counts,
      projectStatuses,
      featureStatuses,
      overdue,
      avgProgress
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
