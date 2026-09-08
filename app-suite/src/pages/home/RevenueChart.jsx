import { useMemo, useState } from "react";
import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardActions,
  PageCardBody,
} from "@/components/PageCard";
import GroupButton from "@/components/GroupButton";
import EmptyState from "@/components/EmptyState";

/* ========================================================================
   Revenue vs Expenses bar chart — inline SVG.
   Expects `data` = [{ key, label, revenue, expenses }, ...]
   ======================================================================== */

function BarChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="No chart data"
        message="Revenue and expenses will appear here once data is available."
      />
    );
  }

  // SVG dimensions
  const PADDING = { top: 8, right: 16, bottom: 28, left: 60 };
  const CHART_HEIGHT = 200;
  const innerW = 600; // viewBox width (scales responsively)
  const innerH = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const barGroupW = innerW / data.length;
  const barW = Math.max(barGroupW * 0.28, 12);
  const barGap = barGroupW * 0.08;
  const maxBarH = innerH - 4;

  const maxVal = Math.max(
    ...data.map((d) => Math.max(d.revenue, d.expenses)),
    1,
  );
  const roundedMax = Math.ceil(maxVal / 5000) * 5000 || 5000;

  // Y-axis ticks
  const ticks = 4;
  const tickStep = roundedMax / ticks;

  return (
    <div style={{ width: "100%" }}>
      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: "var(--sp-4)",
          marginBottom: "var(--sp-4)",
          fontSize: "var(--fs-xs)",
          color: "var(--text-secondary)",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--success)" }} />
          Revenue
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--danger)" }} />
          Expenses
        </span>
      </div>

      {/* SVG Chart */}
      <svg
        viewBox={`0 0 ${innerW} ${CHART_HEIGHT}`}
        style={{ width: "100%", height: CHART_HEIGHT, overflow: "visible" }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Y-axis grid lines & labels */}
        {Array.from({ length: ticks + 1 }, (_, i) => {
          const y = PADDING.top + (innerH * (ticks - i)) / ticks;
          const val = tickStep * i;
          return (
            <g key={i}>
              <line
                x1={PADDING.left}
                y1={y}
                x2={innerW - PADDING.right}
                y2={y}
                stroke="var(--border-light)"
                strokeWidth="1"
              />
              <text
                x={PADDING.left - 8}
                y={y + 4}
                textAnchor="end"
                fill="var(--text-muted)"
                fontSize="10"
                fontFamily="var(--font-sans)"
              >
                ${(val / 1000).toFixed(0)}k
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const cx = PADDING.left + barGroupW * i + barGroupW / 2;
          const revH = (d.revenue / roundedMax) * maxBarH;
          const expH = (d.expenses / roundedMax) * maxBarH;

          return (
            <g key={d.key}>
              {/* Revenue bar */}
              <rect
                className="chart-bar"
                x={cx - barW - barGap / 2}
                y={PADDING.top + maxBarH - revH}
                width={barW}
                height={revH}
                rx="4"
                ry="4"
                fill="var(--success)"
                style={{
                  "--bar-opacity": 0.85,
                  animationDelay: `${i * 0.06}s`,
                }}
              >
                <title>{`Revenue ${d.label}: $${d.revenue.toLocaleString()}`}</title>
              </rect>
              {/* Expenses bar */}
              <rect
                className="chart-bar"
                x={cx + barGap / 2}
                y={PADDING.top + maxBarH - expH}
                width={barW}
                height={expH}
                rx="4"
                ry="4"
                fill="var(--danger)"
                style={{
                  "--bar-opacity": 0.85,
                  animationDelay: `${i * 0.06 + 0.03}s`,
                }}
              >
                <title>{`Expenses ${d.label}: $${d.expenses.toLocaleString()}`}</title>
              </rect>
              {/* X-axis label */}
              <text
                x={cx}
                y={CHART_HEIGHT - 4}
                textAnchor="middle"
                fill="var(--text-muted)"
                fontSize="10"
                fontFamily="var(--font-sans)"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ========================================================================
   RevenueChart card — toggles monthly / weekly, delegates to BarChart.
   `chartData` = { monthly: [...], weekly: [...] }
   ======================================================================== */

export default function RevenueChart({ chartData }) {
  const [chartView, setChartView] = useState("monthly");

  const series = useMemo(() => {
    if (!chartData) return [];
    return Array.isArray(chartData[chartView]) ? chartData[chartView] : [];
  }, [chartData, chartView]);

  return (
    <PageCard>
      <PageCardHeader>
        <PageCardTitle
          title="Revenue vs Expenses"
          subtitle={
            chartView === "monthly"
              ? "Monthly comparison of income and expenditure"
              : "Weekly breakdown of income and expenditure"
          }
        />
        <PageCardActions>
          <GroupButton
            options={[
              { value: "monthly", label: "Monthly" },
              { value: "weekly", label: "Weekly" },
            ]}
            value={chartView}
            name="chartView"
            onChange={(e) => setChartView(e.target.value)}
            size="sm"
          />
        </PageCardActions>
      </PageCardHeader>
      <PageCardBody>
        <BarChart data={series} />
      </PageCardBody>
    </PageCard>
  );
}