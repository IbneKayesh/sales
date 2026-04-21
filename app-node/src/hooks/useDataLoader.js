import React, { useState, useEffect, useCallback, useContext, createContext } from 'react';

const fetchSequential = async (urlFn, signal) => {
  const results = [];
  let id = 1;
  while (true) {
    try {
      const res = await fetch(urlFn(id), { signal });
      if (!res.ok) break;
      const json = await res.json();
      results.push(json);
      id++;
    } catch (e) {
      if (e.name !== 'AbortError') console.error('Fetch sequential error:', e);
      break;
    }
  }
  return results;
};

// Shared context so all components read from the same state
const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [databases, setDatabases] = useState([]);
  const [selectedDatabaseId, setSelectedDatabaseId] = useState(null);
  const [data, setData] = useState({ groups: [], tables: [], group_table_mapping: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDatabases = useCallback(async (signal) => {
    try {
      setLoading(true);
      setError(null);
      const dbs = await fetchSequential(id => `/data/database/${id}.json`, signal);
      setDatabases(dbs);
      if (dbs.length > 0) {
        setSelectedDatabaseId(dbs[0].database_id);
      } else {
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to load databases');
      console.error('Load databases error:', err);
      setLoading(false);
    }
  }, []);

  const loadDatabaseData = useCallback(async (dbId, signal) => {
    if (!dbId) return;
    try {
      setLoading(true);
      setError(null);
      const [databaseData, linkData, groups, tables] = await Promise.all([
        fetch(`/data/database/${dbId}.json`, { signal }).then(res => res.json()),
        fetch(`/data/groups/links.json`, { signal }).then(res => res.json()).catch(() => ({})),
        fetchSequential(id => `/data/groups/${dbId}g${id}.json`, signal),
        fetchSequential(id => `/data/tables/${dbId}/${id}.json`, signal)
      ]);
      setData({
        database: databaseData,
        group_table_mapping: linkData[dbId] || [],
        groups,
        tables
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to load database data');
      console.error('Load data error:', err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadDatabases(controller.signal);
    return () => controller.abort();
  }, [loadDatabases]);

  useEffect(() => {
    const controller = new AbortController();
    loadDatabaseData(selectedDatabaseId, controller.signal);
    return () => controller.abort();
  }, [selectedDatabaseId, loadDatabaseData]);

  const refetch = useCallback(() => {
    loadDatabases(new AbortController().signal);
  }, [loadDatabases]);

  const value = {
    databases,
    selectedDatabaseId,
    setSelectedDatabaseId,
    data,
    loading,
    error,
    refetch
  };

  return React.createElement(DataContext.Provider, { value }, children);
};

/**
 * Hook to access shared data loader state.
 * Must be used inside a <DataProvider>.
 */
export const useDataLoader = () => {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('useDataLoader must be used within a DataProvider');
  }
  return ctx;
};
