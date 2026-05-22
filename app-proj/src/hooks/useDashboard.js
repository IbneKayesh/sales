import { useState, useEffect, useCallback } from 'react';

export default function useDashboard() {
  const [stats, setStats] = useState(null);
  const [activityLog, setActivityLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch stats and activity log in parallel
      const [statsRes, logRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/activity-log')
      ]);

      if (!statsRes.ok) throw new Error('Failed to fetch dashboard metrics');
      if (!logRes.ok) throw new Error('Failed to fetch activity logs');

      const statsData = await statsRes.json();
      const logData = await logRes.json();

      setStats(statsData);
      setActivityLog(logData);
    } catch (err) {
      console.error('[useDashboard] Fetch failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    stats,
    activityLog,
    loading,
    error,
    refresh: fetchDashboardData
  };
}
