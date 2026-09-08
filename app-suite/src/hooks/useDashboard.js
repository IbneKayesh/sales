import { useCallback, useEffect, useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { dashboardAPI } from "@/api/dashboardAPI";

/* ---------- Helpers (fallback computation until backend is live) ---------- */

/** Get the Monday of the week for a given date string (YYYY-MM-DD). */
function getWeekStart(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday
  d.setDate(diff);
  return d;
}

function getWeekKey(dateStr) {
  return getWeekStart(dateStr).toISOString().slice(0, 10); // YYYY-MM-DD of Monday
}

function getWeekLabel(key) {
  const start = new Date(key + "T00:00:00");
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (dt) =>
    dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(start)} — ${fmt(end)}`;
}

/** Group transactions into monthly / weekly buckets with labels. */
function buildChartData(transactions) {
  const groups = { monthly: {}, weekly: {} };

  transactions.forEach((t) => {
    if (!t.date) return;
    const monthKey = t.date.slice(0, 7);
    const weekKey = getWeekKey(t.date);

    ["monthly", "weekly"].forEach((view) => {
      const key = view === "monthly" ? monthKey : weekKey;
      if (!groups[view][key]) groups[view][key] = { revenue: 0, expenses: 0 };
      if (t.type === "income") groups[view][key].revenue += t.amount;
      else groups[view][key].expenses += t.amount;
    });
  });

  const toSeries = (bucket, labelFn) =>
    Object.keys(bucket)
      .sort()
      .map((key) => ({ key, label: labelFn(key), ...bucket[key] }));

  return {
    monthly: toSeries(
      groups.monthly,
      (k) =>
        new Date(parseInt(k.split("-")[0]), parseInt(k.split("-")[1]) - 1).toLocaleDateString(
          "en-US",
          { month: "short", year: "2-digit" },
        ),
    ),
    weekly: toSeries(groups.weekly, getWeekLabel),
  };
}

/** Derive KPI summary from raw lists (fallback). */
function buildSummary(users, transactions) {
  const totalRevenue = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const pendingCount = transactions.filter((t) => t.status === "pending").length;
  const completedCount = transactions.filter((t) => t.status === "completed").length;
  const failedCount = transactions.filter((t) => t.status === "failed").length;

  return {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "active").length,
    adminCount: users.filter((u) => u.role === "admin").length,
    editorCount: users.filter((u) => u.role === "editor").length,
    totalRevenue,
    totalExpenses,
    netBalance: totalRevenue - totalExpenses,
    totalTransactions: transactions.length,
    pendingCount,
    completedCount,
    failedCount,
    completionRate: transactions.length
      ? Math.round((completedCount / transactions.length) * 100)
      : 0,
    revenueShare: totalRevenue
      ? Math.round((totalRevenue / (totalRevenue + totalExpenses)) * 100)
      : 50,
  };
}

/** Latest 5 transactions (fallback). */
function buildRecentTransactions(transactions) {
  return [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
    .map((t) => ({ ...t, _id: t.id }));
}

/* ---------- Hook ---------- */

const useDashboard = () => {
  const { user, users, transactions } = useApp();

  // Fallback values computed from context so the page works before the
  // backend endpoints exist.
  const fallback = useMemo(
    () => ({
      summary: buildSummary(users, transactions),
      chartData: buildChartData(transactions),
      recentTransactions: buildRecentTransactions(transactions),
    }),
    [users, transactions],
  );

  const [summary, setSummary] = useState(fallback.summary);
  const [chartData, setChartData] = useState(fallback.chartData);
  const [recentTransactions, setRecentTransactions] = useState(
    fallback.recentTransactions,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const [summaryResp, chartResp, recentResp] = await Promise.all([
        dashboardAPI.getSummary({}),
        dashboardAPI.getChartData({}),
        dashboardAPI.getRecentTransactions({}),
      ]);

      // Prefer live data when the backend responds; keep fallback otherwise.
      if (summaryResp?.success && summaryResp.data) {
        setSummary((prev) => ({ ...prev, ...summaryResp.data }));
      }
      if (chartResp?.success && chartResp.data) {
        setChartData({
          monthly: Array.isArray(chartResp.data.monthly) ? chartResp.data.monthly : [],
          weekly: Array.isArray(chartResp.data.weekly) ? chartResp.data.weekly : [],
        });
      }
      if (recentResp?.success && Array.isArray(recentResp.data)) {
        setRecentTransactions(recentResp.data);
      }
      setIsLive(
        !!(
          (summaryResp?.success && summaryResp.data) ||
          (chartResp?.success && chartResp.data) ||
          (recentResp?.success && recentResp.data?.length)
        ),
      );
    } catch {
      // keep fallback data
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Defer the initial load out of the effect body (avoids cascading
    // renders from the synchronous setIsLoading call).
    void Promise.resolve().then(refresh);
  }, [refresh]);

  return {
    user,
    summary,
    chartData,
    recentTransactions,
    isLoading,
    isLive,
    refresh,
  };
};

export default useDashboard;