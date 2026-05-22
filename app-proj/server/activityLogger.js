import { query } from './db.js';

/**
 * Logs an entity action to t_activity_log.
 * Never throws — logging failures should not break primary operations.
 */
export async function logActivity(entityType, entityId, entityName, action, details = {}) {
  try {
    await query(
      `INSERT INTO t_activity_log (entity_type, entity_id, entity_name, action, details)
       VALUES ($1, $2, $3, $4, $5)`,
      [entityType, entityId, entityName, action, JSON.stringify(details)]
    );
  } catch (err) {
    console.error('[ActivityLogger] Failed to log activity:', err.message);
  }
}
