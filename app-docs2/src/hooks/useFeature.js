import { useCallback, useEffect, useMemo, useState } from 'react';
import { postJson } from '../lib/api.js';

export function useFeature() {
  const [features, setFeatures] = useState([]);
  const [featureTables, setFeatureTables] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [loadingFeatures, setLoadingFeatures] = useState(false);
  const [loadingFeatureTables, setLoadingFeatureTables] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const refreshFeatures = useCallback(async () => {
    setLoadingFeatures(true);
    try {
      const data = await postJson('/features/list');
      setFeatures(Array.isArray(data?.features) ? data.features : []);
    } finally {
      setLoadingFeatures(false);
    }
  }, []);

  const refreshFeatureTables = useCallback(async (featureId) => {
    if (!featureId) return;
    setLoadingFeatureTables(true);
    try {
      const data = await postJson('/feature-tables/list', { featureId });
      setFeatureTables(Array.isArray(data?.featureTables) ? data.featureTables : []);
    } finally {
      setLoadingFeatureTables(false);
    }
  }, []);

  const refreshTasks = useCallback(async (featureId) => {
    if (!featureId) return;
    setLoadingTasks(true);
    try {
      const data = await postJson('/tasks/list', { featureId });
      setTasks(Array.isArray(data?.tasks) ? data.tasks : []);
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  useEffect(() => {
    // run async to avoid sync setState warnings from lint
    (async () => {
      await refreshFeatures();
    })().catch(() => {});
  }, [refreshFeatures]);




  const tasksSummary = useMemo(() => {
    const done = tasks.filter((t) => t.is_done).length;
    return { done, total: tasks.length };
  }, [tasks]);

  const createFeature = useCallback(async (payload) => postJson('/features/create', payload), []);
  const updateFeature = useCallback(async (featureId, patch) => postJson('/features/update', { featureId, patch }), []);
  const deleteFeature = useCallback(async (featureId) => postJson('/features/delete', { featureId }), []);

  const createTask = useCallback(async (featureId, task) => postJson('/tasks/create', { featureId, task }), []);
  const updateTask = useCallback(async (taskId, patch) => postJson('/tasks/update', { taskId, patch }), []);
  const deleteTask = useCallback(async (taskId) => postJson('/tasks/delete', { taskId }), []);

  return {
    features,
    featureTables,
    tasks,
    loadingFeatures,
    loadingFeatureTables,
    loadingTasks,
    refreshFeatures,
    refreshFeatureTables,
    refreshTasks,
    tasksSummary,
    createFeature,
    updateFeature,
    deleteFeature,
    createTask,
    updateTask,
    deleteTask,
  };
}

