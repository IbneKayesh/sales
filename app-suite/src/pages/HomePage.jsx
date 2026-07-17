import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import PageCard, { PageCardHeader, PageCardTitle, PageCardActions, PageCardBody } from '../components/PageCard'
import DataTable from '../components/DataTable'
import { toast } from '../components/ToastBox'
import DataCard, { DataCardGrid } from '../components/DataCard'
import { IconUsers, IconDollar, IconBox, IconActivity, IconArrowRight, IconCheck, IconWarning, IconInfo, IconClose } from '../icons'
import Badge from '../components/Badge'
import Button from '../components/Button'
import GroupButton from '../components/GroupButton'
import StatListItem from '../components/StatListItem'

/* ---------- Helpers ---------- */

function formatCurrency(n, fractionDigits = 0) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }).format(n)
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/* ========================================================================
   Bar Chart — inline SVG (supports monthly & weekly views)
   ======================================================================== */

/** Get the Monday of the week for a given date string (YYYY-MM-DD). */
function getWeekStart(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday
  d.setDate(diff)
  return d
}

function getWeekLabel(dateStr) {
  const start = getWeekStart(dateStr)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  const fmt = (dt) =>
    dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(start)} — ${fmt(end)}`
}

function getWeekKey(dateStr) {
  const start = getWeekStart(dateStr)
  return start.toISOString().slice(0, 10) // YYYY-MM-DD of Monday
}

function BarChart({ transactions, view }) {
  const chartData = useMemo(() => {
    const groups = {}

    if (view === 'weekly') {
      // Group by ISO week (Monday start)
      transactions.forEach((t) => {
        if (!t.date) return
        const key = getWeekKey(t.date)
        if (!groups[key]) groups[key] = { revenue: 0, expenses: 0 }
        if (t.type === 'income') groups[key].revenue += t.amount
        else groups[key].expenses += t.amount
      })
    } else {
      // Group by month
      transactions.forEach((t) => {
        const key = t.date ? t.date.slice(0, 7) : 'unknown'
        if (!groups[key]) groups[key] = { revenue: 0, expenses: 0 }
        if (t.type === 'income') groups[key].revenue += t.amount
        else groups[key].expenses += t.amount
      })
    }

    const keys = Object.keys(groups).sort()
    if (keys.length === 0) return null

    const data = keys.map((k) => {
      const label =
        view === 'weekly'
          ? getWeekLabel(k)
          : new Date(parseInt(k.split('-')[0]), parseInt(k.split('-')[1]) - 1)
              .toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
      return { key: k, label, ...groups[k] }
    })

    const maxVal = Math.max(...data.map((d) => Math.max(d.revenue, d.expenses)), 1)
    const roundedMax = Math.ceil(maxVal / 5000) * 5000 || 5000

    return { data, maxVal: roundedMax }
  }, [transactions, view])

  if (!chartData) return null

  const { data, maxVal } = chartData

  // SVG dimensions
  const PADDING = { top: 8, right: 16, bottom: 28, left: 60 }
  const CHART_HEIGHT = 200
  const innerW = 600 // viewBox width (scales responsively)
  const innerH = CHART_HEIGHT - PADDING.top - PADDING.bottom
  const barGroupW = innerW / data.length
  const barW = Math.max(barGroupW * 0.28, 12)
  const barGap = barGroupW * 0.08
  const maxBarH = innerH - 4

  // Y-axis ticks
  const ticks = 4
  const tickStep = maxVal / ticks

  return (
    <div style={{ width: '100%' }}>
      {/* Legend */}
      <div style={{
        display: 'flex',
        gap: 'var(--sp-4)',
        marginBottom: 'var(--sp-4)',
        fontSize: 'var(--fs-xs)',
        color: 'var(--text-secondary)',
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--success)' }} />
          Revenue
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--danger)' }} />
          Expenses
        </span>
      </div>

      {/* SVG Chart */}
      <svg
        viewBox={`0 0 ${innerW} ${CHART_HEIGHT}`}
        style={{ width: '100%', height: CHART_HEIGHT, overflow: 'visible' }}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Y-axis grid lines & labels */}
        {Array.from({ length: ticks + 1 }, (_, i) => {
          const y = PADDING.top + (innerH * (ticks - i)) / ticks
          const val = tickStep * i
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
          )
        })}

        {/* Bars */}
        {data.map((d, i) => {
          const cx = PADDING.left + barGroupW * i + barGroupW / 2
          const revH = (d.revenue / maxVal) * maxBarH
          const expH = (d.expenses / maxVal) * maxBarH

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
                  '--bar-opacity': 0.85,
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
                  '--bar-opacity': 0.85,
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
          )
        })}
      </svg>
    </div>
  )
}

/* ---------- Column Definitions ---------- */

const txnColumns = [
  { key: 'date', header: 'Date', width: '110px', render: (v) => <span style={{ whiteSpace: 'nowrap' }}>{formatDate(v)}</span> },
  { key: 'description', header: 'Description', width: 'auto' },
  { key: 'category', header: 'Category', width: '120px' },
  {
    key: 'amount',
    header: 'Amount',
    width: '100px',
    render: (v, row) => (
      <span className={`text-mono text-mono--${row.type === 'income' ? 'success' : 'danger'}`}>
        {row.type === 'income' ? '+' : '–'}{formatCurrency(Math.abs(v), 2)}
      </span>
    ),
  },
  { key: 'type', header: 'Type', width: '80px', render: (v) => <Badge type={v}>{v === 'income' ? 'Income' : 'Expense'}</Badge> },
  {
    key: 'status',
    header: 'Status',
    width: '110px',
    render: (v) => <Badge variant={v === 'completed' ? 'success' : v === 'pending' ? 'warning' : v === 'failed' ? 'danger' : 'muted'} icon={v === 'completed' ? <IconCheck size={12} /> : v === 'pending' ? <IconWarning size={12} /> : v === 'failed' ? <IconClose size={12} /> : <IconInfo size={12} />}>{v.charAt(0).toUpperCase() + v.slice(1)}</Badge>,
  },
]

/* ---------- Page Component ---------- */

export default function HomePage() {
  const { user, users, transactions } = useApp()

  // Compute dashboard metrics from real context data
  const metrics = useMemo(() => {
    const totalRevenue = transactions
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + t.amount, 0)
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0)
    const netBalance = totalRevenue - totalExpenses

    const pendingCount = transactions.filter((t) => t.status === 'pending').length
    const completedCount = transactions.filter((t) => t.status === 'completed').length
    const failedCount = transactions.filter((t) => t.status === 'failed').length
    const completionRate = transactions.length
      ? Math.round((completedCount / transactions.length) * 100)
      : 0

    const activeUsers = users.filter((u) => u.status === 'active').length
    const adminCount = users.filter((u) => u.role === 'admin').length
    const editorCount = users.filter((u) => u.role === 'editor').length

    const revenueShare = totalRevenue
      ? Math.round((totalRevenue / (totalRevenue + totalExpenses)) * 100)
      : 50

    return {
      totalRevenue,
      totalExpenses,
      netBalance,
      pendingCount,
      completedCount,
      failedCount,
      completionRate,
      activeUsers,
      adminCount,
      editorCount,
      revenueShare,
    }
  }, [transactions, users])

  // Last 5 transactions for the table
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)
      .map((t) => ({ ...t, _id: t.id }))
  }, [transactions])

  const [chartView, setChartView] = useState('monthly')

  // Welcome message
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
  const userName = user?.name || 'User'
  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  })()

  return (
    <div className="page-wrap">
      {/* Welcome Section */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 'var(--sp-4)',
        flexWrap: 'wrap',
      }}>
        <div style={{ textAlign: 'left' }}>
          <h2 style={{
            fontSize: 'var(--fs-2xl)',
            fontWeight: 'var(--fw-bold)',
            color: 'var(--text-primary)',
            margin: 0,
            letterSpacing: '-0.3px',
          }}>
            {greeting}, {userName} 👋
          </h2>
          <p style={{
            fontSize: 'var(--fs-sm)',
            color: 'var(--text-muted)',
            margin: 'var(--sp-1) 0 0',
          }}>
            {today} &middot; ERP Dashboard
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--sp-2)', flexShrink: 0 }}>
          <Button variant="secondary" size="sm" onClick={() => toast.info('Dashboard refreshed')}>
            <IconActivity size={14} />
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={() => toast.success('Report exported')}>
            <IconArrowRight size={14} />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <DataCardGrid>
        <DataCard
          variant="accent"
          icon={<IconUsers size={22} />}
          value={users.length}
          label="Total Users"
          badge={`${metrics.activeUsers} active`}
        />
        <DataCard
          variant="success"
          icon={<IconDollar size={22} />}
          value={formatCurrency(metrics.totalRevenue)}
          label="Revenue"
          badge="+8.2%"
          trend="up"
        />
        <DataCard
          variant="warning"
          icon={<IconBox size={22} />}
          value={formatCurrency(metrics.totalExpenses)}
          label="Expenses"
          badge="-3.1%"
          trend="down"
        />
        <DataCard
          variant="secondary"
          icon={<IconActivity size={22} />}
          value={transactions.length}
          label="Transactions"
          badge={`${metrics.pendingCount} pending`}
        />
      </DataCardGrid>

      {/* Revenue/Expenses Chart */}
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Revenue vs Expenses"
            subtitle={chartView === 'monthly' ? 'Monthly comparison of income and expenditure' : 'Weekly breakdown of income and expenditure'}
          />
          <PageCardActions>
            <GroupButton
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'weekly', label: 'Weekly' },
              ]}
              value={chartView}
              name="chartView"
              onChange={(e) => setChartView(e.target.value)}
              size="sm"
            />
          </PageCardActions>
        </PageCardHeader>
        <PageCardBody>
          <BarChart transactions={transactions} view={chartView} />
        </PageCardBody>
      </PageCard>

      {/* Quick Summary Row */}
      <div className="grid" style={{ gap: 'var(--sp-4)' }}>
        <div className="col-span-8">
          {/* Recent Transactions Table */}
          <PageCard>
            <PageCardHeader>
              <PageCardTitle
                title="Recent Transactions"
                subtitle="Latest financial activity across the organization"
              />
            </PageCardHeader>
            <PageCardBody>
              <DataTable
                columns={txnColumns}
                data={recentTransactions}
                pageSize={5}
                sortable
                hoverable
                searchable
                onRowClick={(row) => toast.info(`Transaction: ${row.description}`)}
                emptyMessage="No transactions yet"
              />
            </PageCardBody>
          </PageCard>
        </div>

        <div className="col-span-4">
          {/* Quick Stats Card */}
          <PageCard>
            <PageCardHeader>
              <PageCardTitle
                title="Quick Stats"
                subtitle="At-a-glance overview"
              />
            </PageCardHeader>
            <PageCardBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                <StatListItem label="Total Users" value={users.length} sub={`${metrics.activeUsers} active · ${metrics.adminCount} admin · ${metrics.editorCount} editor`} color="var(--primary)" />
                <StatListItem label="Transactions" value={transactions.length} sub={`${metrics.completedCount} completed · ${metrics.pendingCount} pending · ${metrics.failedCount} failed`} color="var(--warning)" />
                <StatListItem label="Revenue" value={formatCurrency(metrics.totalRevenue)} sub={`Expenses: ${formatCurrency(metrics.totalExpenses)} · ${metrics.revenueShare}% of total flow`} color="var(--success)" />
                <StatListItem label="Net Balance" value={formatCurrency(metrics.netBalance)} sub={`${metrics.completionRate}% completion rate · ${transactions.length} total transactions`} color={metrics.netBalance >= 0 ? 'var(--success)' : 'var(--danger)'} />
              </div>
            </PageCardBody>
          </PageCard>
        </div>
      </div>
    </div>
  )
}
