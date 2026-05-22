import { useState, useCallback } from 'react';

/**
 * Backward-compatible full refresh hook (kept for retry / initial load).
 */
export function useSchemaDataFullRefresh() {
  const [dbStatus, setDbStatus] = useState({
    status: 'disconnected',
    counts: { modules: 0, submodules: 0, tables: 0, columns: 0, features: 0, tableFeatures: 0 },
  });

  const [projects, setProjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [submodules, setSubmodules] = useState([]);
  const [tables, setTables] = useState([]);
  const [columns, setColumns] = useState([]);
  const [features, setFeatures] = useState([]);
  const [tableFeatures, setTableFeatures] = useState([]);


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statusRes, projRes, modRes, subRes, tblRes, colRes, featRes, tableFeatRes] = await Promise.all([
        fetch('/api/db-status'),
        fetch('/api/projects'),
        fetch('/api/modules'),
        fetch('/api/submodules'),
        fetch('/api/tables'),
        fetch('/api/columns'),
        fetch('/api/features'),
        fetch('/api/table-features'),
      ]);


      if (!statusRes.ok) throw new Error('Could not reach PostgreSQL backend');

      const [statusData, projData, modData, subData, tblData, colData, featData, tableFeatData] = await Promise.all([
        statusRes.json(),
        projRes.json(),
        modRes.json(),
        subRes.json(),
        tblRes.json(),
        colRes.json(),
        featRes.json(),
        tableFeatRes.json(),
      ]);


      setDbStatus(statusData);
      setProjects(projData);
      setModules(modData);
      setSubmodules(subData);

      setTables(tblData);
      setColumns(colData);
      setFeatures(featData);
      setTableFeatures(tableFeatData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
      setError(err.message || 'Backend or DB offline. Run: npm start');
      setDbStatus({
        status: 'disconnected',
        counts: { modules: 0, submodules: 0, tables: 0, columns: 0, features: 0, tableFeatures: 0 },
      });
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);


  return {
    dbStatus,
    modules,
    submodules,
    tables,
    columns,
    features,
    tableFeatures,
    loading,
    error,
    lastUpdated,
    projects,
    fetchData,

    // Expose setters for targeted refresh hook to update same sources
    _setDbStatus: setDbStatus,

    _setProjects: setProjects,
    _setModules: setModules,
    _setSubmodules: setSubmodules,

    _setTables: setTables,
    _setColumns: setColumns,
    _setFeatures: setFeatures,
    _setTableFeatures: setTableFeatures,
    _setLoading: setLoading,
    _setError: setError,
    _setLastUpdated: setLastUpdated,
  };
}

