import { useCallback } from 'react';
import { useSchemaDataFullRefresh } from './useSchemaDataFullRefresh.js';

async function safeJson(res) {
  return await res.json();
}

function createFullRefresher(fetchData) {
  return fetchData;
}

/**
 * Targeted refresh-capable schema hook.
 * - Keeps initial behavior via full refresh when needed.
 * - Exposes targeted refreshers so add/edit/delete do NOT refetch everything.
 */
export function useSchemaData() {
  const full = useSchemaDataFullRefresh();

  const refreshDbStatus = useCallback(async () => {
    full._setLoading(true);
    full._setError(null);
    try {
      const res = await fetch('/api/db-status');
      if (!res.ok) throw new Error('Could not reach PostgreSQL backend');
      const data = await safeJson(res);
      full._setDbStatus(data);
      full._setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      full._setError(err.message || 'Backend or DB offline');
    } finally {
      full._setLoading(false);
    }
  }, [full]);

  const refreshProjects = useCallback(async () => {
    full._setLoading(true);
    full._setError(null);
    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error('Failed to fetch projects');
      full._setProjects(await safeJson(res));
      full._setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      full._setError(err.message || 'Backend or DB offline');
    } finally {
      full._setLoading(false);
    }
  }, [full]);

  const refreshModules = useCallback(async () => {
    full._setLoading(true);
    full._setError(null);
    try {
      const res = await fetch('/api/modules');
      if (!res.ok) throw new Error('Failed to fetch modules');
      full._setModules(await safeJson(res));
      full._setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      full._setError(err.message || 'Backend or DB offline');
    } finally {
      full._setLoading(false);
    }
  }, [full]);


  const refreshSubmodules = useCallback(async () => {
    full._setLoading(true);
    full._setError(null);
    try {
      const res = await fetch('/api/submodules');
      if (!res.ok) throw new Error('Failed to fetch submodules');
      full._setSubmodules(await safeJson(res));
      full._setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      full._setError(err.message || 'Backend or DB offline');
    } finally {
      full._setLoading(false);
    }
  }, [full]);

  const refreshTables = useCallback(async () => {
    full._setLoading(true);
    full._setError(null);
    try {
      const res = await fetch('/api/tables');
      if (!res.ok) throw new Error('Failed to fetch tables');
      full._setTables(await safeJson(res));
      full._setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      full._setError(err.message || 'Backend or DB offline');
    } finally {
      full._setLoading(false);
    }
  }, [full]);

  const refreshColumns = useCallback(async () => {
    full._setLoading(true);
    full._setError(null);
    try {
      const res = await fetch('/api/columns');
      if (!res.ok) throw new Error('Failed to fetch columns');
      full._setColumns(await safeJson(res));
      full._setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      full._setError(err.message || 'Backend or DB offline');
    } finally {
      full._setLoading(false);
    }
  }, [full]);

  const refreshFeatures = useCallback(async () => {
    full._setLoading(true);
    full._setError(null);
    try {
      const res = await fetch('/api/features');
      if (!res.ok) throw new Error('Failed to fetch features');
      full._setFeatures(await safeJson(res));
      full._setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      full._setError(err.message || 'Backend or DB offline');
    } finally {
      full._setLoading(false);
    }
  }, [full]);

  const refreshTableFeatures = useCallback(async () => {
    full._setLoading(true);
    full._setError(null);
    try {
      const res = await fetch('/api/table-features');
      if (!res.ok) throw new Error('Failed to fetch table links');
      full._setTableFeatures(await safeJson(res));
      full._setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      full._setError(err.message || 'Backend or DB offline');
    } finally {
      full._setLoading(false);
    }
  }, [full]);

  // Composite targeted refreshers
  const refreshForAddEditDeleteProject = useCallback(async () => {
    await Promise.all([
      refreshDbStatus(),
      refreshProjects(),
      refreshModules(),
      refreshSubmodules(),
      refreshFeatures(),
    ]);
  }, [
    refreshDbStatus,
    refreshProjects,
    refreshModules,
    refreshSubmodules,
    refreshFeatures,
  ]);

  const refreshForAddEditDeleteModule = useCallback(async () => {
    await Promise.all([
      refreshDbStatus(),
      refreshProjects(),
      refreshModules(),
      refreshSubmodules(),
      refreshFeatures(),
    ]);
  }, [
    refreshDbStatus,
    refreshProjects,
    refreshModules,
    refreshSubmodules,
    refreshFeatures,
  ]);

  const refreshForAddEditDeleteSubmodule = useCallback(async () => {
    await Promise.all([refreshDbStatus(), refreshSubmodules(), refreshFeatures()]);
  }, [refreshDbStatus, refreshSubmodules, refreshFeatures]);


  const refreshForAddEditDeleteFeature = useCallback(async () => {
    await Promise.all([refreshDbStatus(), refreshFeatures(), refreshTableFeatures()]);
  }, [refreshDbStatus, refreshFeatures, refreshTableFeatures]);

  const refreshForLinkUnlinkTableFeature = useCallback(async () => {
    await Promise.all([refreshDbStatus(), refreshTableFeatures()]);
  }, [refreshDbStatus, refreshTableFeatures]);

  const refreshForAddEditDeleteTable = useCallback(async () => {
    await Promise.all([refreshDbStatus(), refreshTables(), refreshColumns(), refreshTableFeatures()]);
  }, [refreshDbStatus, refreshTables, refreshColumns, refreshTableFeatures]);

  const refreshForAddEditDeleteColumn = useCallback(async () => {
    await Promise.all([refreshDbStatus(), refreshColumns()]);
  }, [refreshDbStatus, refreshColumns]);

  return {
    dbStatus: full.dbStatus,
    projects: full.projects,
    modules: full.modules,
    submodules: full.submodules,

    tables: full.tables,
    columns: full.columns,
    features: full.features,
    tableFeatures: full.tableFeatures,
    loading: full.loading,
    error: full.error,
    lastUpdated: full.lastUpdated,

    // Keep full refresh available (initial load + retry)
    fetchData: createFullRefresher(full.fetchData),

    // Targeted refreshers for UX
    refreshDbStatus,
    refreshModules,
    refreshSubmodules,
    refreshTables,
    refreshColumns,
    refreshFeatures,
    refreshTableFeatures,

    refreshForAddEditDeleteProject,
    refreshForAddEditDeleteModule,

    refreshForAddEditDeleteSubmodule,
    refreshForAddEditDeleteFeature,
    refreshForLinkUnlinkTableFeature,
    refreshForAddEditDeleteTable,
    refreshForAddEditDeleteColumn,
  };
}

